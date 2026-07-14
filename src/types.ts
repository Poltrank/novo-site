export interface ClientProfile {
  id?: string;
  companyName: string;
  cnpj: string;
  representative: string;
  email: string;
  createdAt: any; // Timestamp or date string
}

export interface SupportTicket {
  id: string;
  companyName: string;
  employeeName: string;
  email: string;
  whatsapp: string;
  role: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  anydesk: boolean;
  status: 'received' | 'analyzing' | 'in_progress' | 'completed';
  response?: string;
  clientId: string; // empty string for anonymous, or actual clientId
  createdAt: any;
  updatedAt: any;
}

export interface CustomerReview {
  id: string;
  name: string;
  companyName: string;
  rating: number; // 1 to 5
  comment: string;
  createdAt: any;
}
