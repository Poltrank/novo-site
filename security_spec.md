# Security Specification: Tech Support B2B

## 1. Data Invariants
- **Authentication**: All client-specific documents (`clients/{clientId}`) can only be read or written by the authenticated user matching `clientId` (or an Administrator).
- **Immutable Fields**: `createdAt` and `clientId` fields must not be altered during updates.
- **Strict Keys**: Documents cannot have extra "ghost" fields.
- **Priority and Status Boundaries**:
  - `priority` can only be one of `['low', 'medium', 'high', 'urgent']`.
  - `status` can only be one of `['received', 'analyzing', 'in_progress', 'completed']`.
- **Admin Isolation**: Admin actions, such as changing a ticket's status, responding to a ticket, or deleting reviews, are strictly locked down to administrators verified through the admins database collection or runtime bootstrapped email.

---

## 2. The "Dirty Dozen" Payloads
The following payloads are designed to attack the system. The Security Rules must reject every single one of them.

### Attack Vector A: Identity Spoofing & Escalation
1. **Payload 01: Client Profile Hijack (Create)**
   An attacker tries to create a client document with another user's `clientId`.
   ```json
   // PATH: /clients/victim_user_123
   // AUTH: uid = attacker_456, email = "attacker@evil.com"
   {
     "companyName": "Evil Corp",
     "cnpj": "12345678000199",
     "representative": "Loki",
     "email": "victim@trusted.com",
     "createdAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (UID mismatch)

2. **Payload 02: Self-Promotion to Admin**
   An attacker tries to set their email as an admin or write to the `/admins/` collection.
   ```json
   // PATH: /admins/attacker_456
   // AUTH: uid = attacker_456
   {
     "email": "attacker@evil.com",
     "grantedBy": "attacker_456"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (Write to admins collection restricted to actual system setup / offline configuration)

3. **Payload 03: Ticket Owner Spoofing**
   An attacker opens a ticket under someone else's registered client ID.
   ```json
   // PATH: /tickets/ticket_abc
   // AUTH: uid = attacker_456
   {
     "companyName": "Victim Inc",
     "employeeName": "John Doe",
     "email": "john@victim.com",
     "whatsapp": "+5511999999999",
     "role": "Analyst",
     "description": "My computer is broken, help!",
     "priority": "low",
     "anydesk": true,
     "status": "received",
     "clientId": "victim_user_123",
     "createdAt": "2026-07-14T10:00:51Z",
     "updatedAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (clientId must match request.auth.uid)

### Attack Vector B: Resource Exhaustion & Payload Poisoning
4. **Payload 04: Deny-of-Wallet (1MB Field Value)**
   An attacker injects an incredibly long string into the ticket description to inflate storage costs.
   ```json
   // PATH: /tickets/ticket_overflow
   // AUTH: uid = user_123
   {
     "companyName": "Standard Company",
     "employeeName": "Employee",
     "email": "emp@company.com",
     "whatsapp": "+5511999999999",
     "role": "Manager",
     "description": "[... 1,000,000 characters ...]",
     "priority": "low",
     "anydesk": true,
     "status": "received",
     "createdAt": "2026-07-14T10:00:51Z",
     "updatedAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (Length bounds violation: description size <= 2000)

5. **Payload 05: Invalid ID Format (ID Poisoning)**
   An attacker targets the database with long, junk-character document IDs.
   ```json
   // PATH: /tickets/Junk$$$$%%%%####!!!!____----
   // AUTH: uid = user_123
   {
     "companyName": "Some Corp",
     "employeeName": "Name",
     "email": "name@corp.com",
     "whatsapp": "+5511999999999",
     "role": "Tester",
     "description": "Short description of issues",
     "priority": "high",
     "anydesk": false,
     "status": "received",
     "createdAt": "2026-07-14T10:00:51Z",
     "updatedAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (ID matches regex rules and length boundaries)

6. **Payload 06: Invalid Rating Value (Integer Overflow)**
   An attacker submits a review with a rating of 100 instead of 1-5.
   ```json
   // PATH: /reviews/bad_review_1
   // AUTH: uid = user_123
   {
     "name": "Hacker",
     "companyName": "Hacker Corp",
     "rating": 100,
     "comment": "Best support ever",
     "createdAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (Rating must be >= 1 and <= 5)

### Attack Vector C: State Bypass & Field Tampering
7. **Payload 07: Client Attempting status = 'completed' on Creation**
   A client tries to open a ticket that is already flagged as completed.
   ```json
   // PATH: /tickets/ticket_completed_cheat
   // AUTH: uid = user_123
   {
     "companyName": "My Corp",
     "employeeName": "Worker",
     "email": "worker@corp.com",
     "whatsapp": "+5511999999999",
     "role": "Staff",
     "description": "My software needs setup",
     "priority": "low",
     "anydesk": true,
     "status": "completed",
     "createdAt": "2026-07-14T10:00:51Z",
     "updatedAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (New tickets must start with status = 'received')

8. **Payload 08: Client Hijacking Admin Response**
   An ordinary user tries to update the admin response field of a ticket.
   ```json
   // PATH: /tickets/ticket_123
   // AUTH: uid = user_123
   {
     "companyName": "My Corp",
     "employeeName": "Worker",
     "email": "worker@corp.com",
     "whatsapp": "+5511999999999",
     "role": "Staff",
     "description": "Updated problem details",
     "priority": "low",
     "anydesk": true,
     "status": "received",
     "response": "Support team has closed this with a credit", // <-- GHOST ADMIN FIELD
     "createdAt": "2026-07-14T10:00:51Z",
     "updatedAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (Non-admin is forbidden from updating response fields)

9. **Payload 09: Client Overriding createdAt (Temporal Tampering)**
   An attacker tries to post a review or ticket with a spoofed historic timestamp or a future timestamp instead of the server's time.
   ```json
   // PATH: /tickets/ticket_time_cheat
   // AUTH: uid = user_123
   {
     ...
     "createdAt": "1999-01-01T00:00:00Z", // <-- Spoofed
     "updatedAt": "2026-07-14T10:00:51Z"
   }
   ```
   *Expected Result*: `PERMISSION_DENIED` (createdAt must match request.time)

### Attack Vector D: Unauthorized Operations & Deletions
10. **Payload 10: Anonymous Review deletion**
    An attacker tries to delete a positive review of a company competitor.
    ```json
    // ACTION: DELETE /reviews/review_999
    // AUTH: uid = attacker_456
    ```
    *Expected Result*: `PERMISSION_DENIED` (Only admins can delete reviews)

11. **Payload 11: Stealing All Client Data (Blanket Read)**
    An attacker attempts a collection-wide read query without proper filtering to inspect all other corporate clients.
    ```javascript
    // ACTION: LIST /clients
    // AUTH: uid = attacker_456
    // QUERY: db.collection('clients')
    ```
    *Expected Result*: `PERMISSION_DENIED` (Only admin can list, users can only read their specific ID document)

12. **Payload 12: Ticket Hijack (Change Status)**
    An ordinary user tries to update a ticket's status directly to change priority or assign support response.
    ```json
    // ACTION: UPDATE /tickets/ticket_123
    // AUTH: uid = user_123
    // CHANGES: { "status": "completed" }
    ```
    *Expected Result*: `PERMISSION_DENIED` (Ordinary user can only edit description/priority while in 'received' state, cannot alter status)

---

## 3. Test Runner Definition (Mocked Testing Interface)
A testing suite verifying these invariants in TypeScript:

```typescript
import { assertFails, assertSucceeds, initializeTestEnvironment } from '@firebase/rules-unit-testing';

describe('Tech Support B2B Security Rules', () => {
  let testEnv: any;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: 'thermal-anchor-m98sv',
      firestore: {
        rules: require('fs').readFileSync('firestore.rules', 'utf8')
      }
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  it('rejects Client Profile Hijack (Payload 01)', async () => {
    const context = testEnv.authenticatedContext('attacker_456', { email: 'attacker@evil.com' });
    const db = context.firestore();
    const docRef = db.doc('clients/victim_user_123');
    await assertFails(docRef.set({
      companyName: 'Evil Corp',
      cnpj: '12345678000199',
      representative: 'Loki',
      email: 'victim@trusted.com',
      createdAt: new Date()
    }));
  });

  it('forbids Self-Promotion to Admin (Payload 02)', async () => {
    const context = testEnv.authenticatedContext('attacker_456');
    const db = context.firestore();
    await assertFails(db.doc('admins/attacker_456').set({
      email: 'attacker@evil.com',
      grantedBy: 'attacker_456'
    }));
  });

  it('blocks Ticket Owner Spoofing (Payload 03)', async () => {
    const context = testEnv.authenticatedContext('attacker_456');
    const db = context.firestore();
    await assertFails(db.collection('tickets').add({
      companyName: 'Victim Inc',
      employeeName: 'John Doe',
      email: 'john@victim.com',
      whatsapp: '+5511999999999',
      role: 'Analyst',
      description: 'My computer is broken, help!',
      priority: 'low',
      anydesk: true,
      status: 'received',
      clientId: 'victim_user_123',
      createdAt: new Date(),
      updatedAt: new Date()
    }));
  });
});
```
