import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Shield, Cpu, User, LogOut, Settings } from 'lucide-react';
import { auth } from '../firebase';
import { User as FirebaseUser } from 'firebase/auth';

interface NavbarProps {
  user: FirebaseUser | null;
  isAdmin: boolean;
  onNavigate: (view: string) => void;
  currentView: string;
  onLogout: () => void;
  onOpenAuth: () => void;
}

export default function Navbar({
  user,
  isAdmin,
  onNavigate,
  currentView,
  onLogout,
  onOpenAuth,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: 'home', label: 'Início' },
    { id: 'services', label: 'Serviços' },
    { id: 'why-us', label: 'Diferenciais' },
    { id: 'about', label: 'Sobre Nós' },
    { id: 'reviews', label: 'Avaliações' },
    { id: 'contact', label: 'Contato' },
  ];

  const handleItemClick = (id: string) => {
    onNavigate(id);
    setIsOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-panel border-b border-white/5 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div 
            onClick={() => handleItemClick('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
            id="nav-logo"
          >
            <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center not-italic shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <div>
              <span className="font-display font-bold text-xl tracking-tight text-white flex items-center gap-1.5 italic">
                NEXUS<span className="text-sky-400">SUPORTE</span>
              </span>
              <p className="text-[9px] text-slate-500 font-sans tracking-widest uppercase font-semibold">TI Corporativa Remota</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex gap-8 text-xs font-semibold uppercase tracking-widest">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`transition-colors duration-200 relative py-2 cursor-pointer ${
                  currentView === item.id ? 'text-sky-400' : 'text-slate-300 hover:text-sky-400'
                }`}
                id={`nav-link-${item.id}`}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* User Controls */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pl-3 pr-2 py-1.5">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-semibold text-gray-200">
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                  <span className="text-[10px] text-sky-400 font-mono flex items-center gap-1">
                    {isAdmin ? (
                      <>
                        <Settings className="w-2.5 h-2.5 animate-spin text-sky-400" /> Admin
                      </>
                    ) : (
                      <>
                        <Cpu className="w-2.5 h-2.5 text-sky-400" /> Cliente
                      </>
                    )}
                  </span>
                </div>
                <div 
                  onClick={() => onNavigate(isAdmin ? 'admin' : 'client')}
                  className="w-8 h-8 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold cursor-pointer hover:scale-105 transition-transform"
                  title="Acessar Painel"
                >
                  <User className="w-4 h-4" />
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                  title="Sair"
                  id="btn-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={onOpenAuth}
                  className="px-5 py-2 rounded-full border border-sky-500/30 text-sky-400 text-sm hover:bg-sky-500/10 transition-all cursor-pointer"
                  id="nav-btn-auth"
                >
                  Área do Cliente
                </button>
                <button
                  onClick={() => onNavigate('ticket-form')}
                  className="px-5 py-2 rounded-full bg-sky-500 text-white text-sm font-semibold shadow-lg shadow-sky-500/20 hover:bg-sky-400 active:scale-95 transition-all cursor-pointer"
                  id="nav-btn-guest-ticket"
                >
                  Abrir Chamado
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Menu Icon */}
          <div className="flex lg:hidden items-center gap-3">
            {user && (
              <div 
                onClick={() => onNavigate(isAdmin ? 'admin' : 'client')}
                className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 flex items-center justify-center text-white cursor-pointer"
              >
                <User className="w-4 h-4" />
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              id="mobile-menu-toggle"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/5 bg-slate-950/95 backdrop-blur-2xl overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-2.5">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-base font-semibold tracking-wide transition-all ${
                    currentView === item.id
                      ? 'bg-blue-600/10 text-blue-400 border border-blue-500/20'
                      : 'text-gray-300 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
                <button
                  onClick={() => handleItemClick('ticket-form')}
                  className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold border border-white/10 text-white hover:bg-white/5 transition-all"
                >
                  Abrir Chamado Rápido
                </button>
                {user ? (
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => handleItemClick(isAdmin ? 'admin' : 'client')}
                      className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-white/5 border border-white/10 text-blue-400 hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      <User className="w-4 h-4" /> Meu Painel {isAdmin ? '(Admin)' : ''}
                    </button>
                    <button
                      onClick={() => {
                        onLogout();
                        setIsOpen(false);
                      }}
                      className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-red-600/10 text-red-400 border border-red-500/20 hover:bg-red-600/20 transition-all"
                    >
                      Desconectar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      onOpenAuth();
                      setIsOpen(false);
                    }}
                    className="w-full text-center px-4 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-cyan-500 text-white transition-all flex items-center justify-center gap-2"
                  >
                    <User className="w-4 h-4" /> Área do Cliente / Cadastro
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
