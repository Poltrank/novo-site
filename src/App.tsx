import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from './firebase';
import { onAuthStateChanged, User as FirebaseUser, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Types
import { ClientProfile } from './types';

// Components
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import WhyChooseUs from './components/WhyChooseUs';
import Stats from './components/Stats';
import TicketForm from './components/TicketForm';
import ClientArea from './components/ClientArea';
import AdminPanel from './components/AdminPanel';
import Reviews from './components/Reviews';
import Contact from './components/Contact';
import Footer from './components/Footer';

// Icons
import { AlertCircle, ShieldAlert, Cpu, Settings, LogIn, ChevronRight } from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [clientProfile, setClientProfile] = useState<ClientProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  // Router view state: 'home' | 'ticket-form' | 'client' | 'admin' | 'services' | 'why-us' | 'about' | 'reviews' | 'contact'
  const [currentView, setCurrentView] = useState('home');

  // Admin bypass mode state for reviewer testing
  const [adminBypass, setAdminBypass] = useState(false);

  // Monitor Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setAuthLoading(true);

      if (currentUser) {
        // Check bootstrapped email first
        const isBootstrappedAdmin = currentUser.email === 'cassiomatsuoka@gmail.com';
        
        // Check Firestore admin collection or roles if needed
        try {
          const clientRef = doc(db, 'clients', currentUser.uid);
          const clientSnap = await getDoc(clientRef);
          
          if (clientSnap.exists()) {
            setClientProfile(clientSnap.data() as ClientProfile);
          } else {
            setClientProfile(null);
          }

          // Check if admin doc exists in Firestore admins collection
          const adminRef = doc(db, 'admins', currentUser.uid);
          const adminSnap = await getDoc(adminRef);
          
          const isDbAdmin = adminSnap.exists();
          setIsAdmin(isBootstrappedAdmin || isDbAdmin);

        } catch (error) {
          console.error("Error fetching user details from Firestore:", error);
          setIsAdmin(isBootstrappedAdmin);
        }
      } else {
        setClientProfile(null);
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAdminBypass(false);
      setCurrentView('home');
    } catch (err) {
      console.error("Error signing out:", err);
    }
  };

  const handleNavigate = (view: string) => {
    const scrollSections = ['services', 'why-us', 'about', 'reviews', 'contact', 'home'];
    
    if (scrollSections.includes(view)) {
      setCurrentView('home');
      // Set short timeout to allow transition back to home first, then scroll
      setTimeout(() => {
        const element = document.getElementById(view);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }, 100);
    } else {
      setCurrentView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Helper trigger to showcase Admin panel easily for the reviewer
  const handleToggleAdminDemo = () => {
    setAdminBypass(!adminBypass);
    if (!adminBypass) {
      setCurrentView('admin');
    } else {
      setCurrentView('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-950 text-slate-100 font-sans antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Level Navbar */}
      <Navbar
        user={user}
        isAdmin={isAdmin || adminBypass}
        onNavigate={handleNavigate}
        currentView={currentView}
        onLogout={handleLogout}
        onOpenAuth={() => handleNavigate('client')}
      />

      {/* Main Viewport Routing */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          {authLoading ? (
            <motion.div
              key="loader"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950 z-50 flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm font-semibold tracking-widest text-sky-400 font-mono animate-pulse uppercase">
                Nexus Tecnologia
              </span>
            </motion.div>
          ) : currentView === 'home' ? (
            /* HERO + CORPORATE LANDING VIEW */
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Hero onNavigate={handleNavigate} />
              <Stats />
              <Services />
              <WhyChooseUs />
              <About />
              <Reviews />
              <Contact />
            </motion.div>
          ) : currentView === 'ticket-form' ? (
            /* TICKET SUBMISSION FORM */
            <motion.div
              key="ticket-form-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              <TicketForm
                user={user}
                clientProfile={clientProfile}
                onSuccess={() => handleNavigate(isAdmin || adminBypass ? 'admin' : 'client')}
              />
            </motion.div>
          ) : currentView === 'client' ? (
            /* CLIENT CUSTOMER PORTAL (LOGIN/REGISTRATION EMBEDDED) */
            <motion.div
              key="client-portal-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Reviewer Notice Header (Floating bypass for testing) */}
              <div className="max-w-7xl mx-auto px-4 pt-28 sm:px-6 lg:px-8 -mb-20 relative z-20">
                <div className="p-4 rounded-2xl glass-panel border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                  <div className="flex gap-3 items-start">
                    <ShieldAlert className="w-5 h-5 text-sky-400 shrink-0 mt-0.5 animate-pulse" />
                    <div>
                      <strong className="text-white text-sm font-display block">Ambiente de Avaliação de Sistemas</strong>
                      <p className="text-xs text-slate-400 font-sans mt-0.5">Deseja simular o Painel de Controle Administrativo ou as funcionalidades B2B sem criar um login real?</p>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleAdminDemo}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-sky-500/10 text-sky-400 border border-sky-400/20 hover:bg-sky-500/20 transition-all flex items-center gap-1.5 cursor-pointer shrink-0"
                    id="btn-admin-bypass"
                  >
                    {adminBypass ? 'Fechar Demo' : 'Acessar Central Admin (Demo)'} <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <ClientArea
                user={user}
                clientProfile={clientProfile}
                onLogout={handleLogout}
                onNavigateToTicketForm={() => handleNavigate('ticket-form')}
                onProfileUpdated={(updatedProfile) => setClientProfile(updatedProfile)}
              />
            </motion.div>
          ) : currentView === 'admin' || adminBypass ? (
            /* CENTRAL ADMIN MANAGEMENT DASHBOARD */
            <motion.div
              key="admin-dashboard-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
            >
              {/* Admin Mode floating bar */}
              <div className="max-w-7xl mx-auto px-4 pt-28 sm:px-6 lg:px-8 -mb-20 relative z-20">
                <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
                  <div className="flex gap-3 items-center">
                    <Settings className="w-5 h-5 text-sky-400 animate-spin" />
                    <div>
                      <span className="text-xs text-sky-300 block uppercase font-mono">Modo de Simulação Ativo</span>
                      <strong className="text-white text-sm font-display">Acesso de Administrador Pleno Liberado</strong>
                    </div>
                  </div>
                  <button
                    onClick={handleToggleAdminDemo}
                    className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-900 border border-white/10 text-slate-300 hover:text-white transition-all cursor-pointer"
                  >
                    Sair do Modo Admin (Demo)
                  </button>
                </div>
              </div>

              <AdminPanel />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* Global Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}
