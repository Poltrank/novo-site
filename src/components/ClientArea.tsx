import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Lock, Building, FileText, Check, Cpu, RefreshCw, LogOut, PlusCircle, 
  Clock, Shield, Clipboard, CheckCircle, AlertTriangle, ChevronRight, Mail, Phone, Info
} from 'lucide-react';
import { auth, db, handleFirestoreError, OperationType } from '../firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail, 
  updateProfile,
  User as FirebaseUser 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { SupportTicket, ClientProfile } from '../types';

interface ClientAreaProps {
  user: FirebaseUser | null;
  clientProfile: ClientProfile | null;
  onLogout: () => void;
  onNavigateToTicketForm: () => void;
  onProfileUpdated: (profile: ClientProfile) => void;
}

export default function ClientArea({
  user,
  clientProfile,
  onLogout,
  onNavigateToTicketForm,
  onProfileUpdated,
}: ClientAreaProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isReset, setIsReset] = useState(false);

  // Login Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Register Form fields
  const [companyName, setCompanyName] = useState('');
  const [cnpj, setCnpj] = useState('');
  const [representative, setRepresentative] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');

  // General States
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Tickets List state
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  // Fetch client tickets once logged in
  useEffect(() => {
    if (user) {
      fetchTickets();
    }
  }, [user]);

  const fetchTickets = async () => {
    if (!user) return;
    setLoadingTickets(true);
    try {
      const ticketsRef = collection(db, 'tickets');
      const q = query(
        ticketsRef, 
        where('clientId', '==', user.uid),
        orderBy('createdAt', 'desc')
      );
      const snapshot = await getDocs(q);
      const ticketList: SupportTicket[] = [];
      snapshot.forEach((doc) => {
        ticketList.push({ id: doc.id, ...doc.data() } as SupportTicket);
      });
      setTickets(ticketList);
    } catch (err) {
      console.error("Error fetching tickets:", err);
    } finally {
      setLoadingTickets(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setSuccessMsg('Login efetuado com sucesso!');
    } catch (err: any) {
      let friendlyError = 'E-mail ou senha incorretos.';
      if (err.code === 'auth/invalid-email') friendlyError = 'Formato de e-mail inválido.';
      if (err.code === 'auth/user-not-found') friendlyError = 'Conta de cliente não cadastrada.';
      if (err.code === 'auth/wrong-password') friendlyError = 'Senha digitada incorretamente.';
      setErrorMsg(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cnpj.replace(/\D/g, '').length < 14) {
      setErrorMsg('CNPJ deve conter 14 dígitos válidos.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Create User
      const userCredential = await createUserWithEmailAndPassword(auth, regEmail.trim(), regPassword);
      const newUser = userCredential.user;

      // 2. Set Profile Display Name
      await updateProfile(newUser, { displayName: representative });

      // 3. Create Client Profile Document
      const clientData: ClientProfile = {
        companyName: companyName.trim(),
        cnpj: cnpj.trim(),
        representative: representative.trim(),
        email: regEmail.trim(),
        createdAt: serverTimestamp(),
      };

      await setDoc(doc(db, 'clients', newUser.uid), clientData);
      
      onProfileUpdated(clientData);
      setSuccessMsg('Conta criada com sucesso e empresa registrada!');
    } catch (err: any) {
      let friendlyError = 'Não foi possível cadastrar a empresa.';
      if (err.code === 'auth/email-already-in-use') friendlyError = 'Este e-mail corporativo já está em uso.';
      if (err.code === 'auth/weak-password') friendlyError = 'A senha deve conter no mínimo 6 caracteres.';
      setErrorMsg(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSuccessMsg('E-mail de recuperação de senha enviado com sucesso!');
      setTimeout(() => {
        setIsReset(false);
        setIsLogin(true);
      }, 3000);
    } catch (err: any) {
      let friendlyError = 'Não foi possível enviar a redefinição de senha.';
      if (err.code === 'auth/user-not-found') friendlyError = 'E-mail não cadastrado em nosso sistema.';
      setErrorMsg(friendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: SupportTicket['status']) => {
    const configs = {
      received: { label: 'Recebido', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
      analyzing: { label: 'Em Análise', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
      in_progress: { label: 'Em Atendimento', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
      completed: { label: 'Finalizado', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
    };
    const config = configs[status] || configs.received;
    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const configs = {
      low: { label: 'Baixa', color: 'text-slate-400' },
      medium: { label: 'Média', color: 'text-sky-400' },
      high: { label: 'Alta', color: 'text-amber-400' },
      urgent: { label: 'Urgente', color: 'text-rose-400 font-bold animate-pulse' },
    };
    const config = configs[priority] || configs.medium;
    return (
      <span className={`text-xs ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Agora';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="py-28 relative bg-slate-950 min-h-screen">
      {/* Visual background accents */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* If user is NOT logged in */}
        {!user ? (
          <div className="max-w-md mx-auto">
            
            {/* Header Title */}
            <div className="text-center space-y-3 mb-8">
              <div className="mx-auto p-3 rounded-2xl bg-sky-500/10 text-sky-400 w-fit">
                <Cpu className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-display font-bold text-white tracking-tight">
                {isReset ? 'Recuperar Senha' : isLogin ? 'Área do Cliente' : 'Cadastre sua Empresa'}
              </h2>
              <p className="text-sm text-gray-400">
                {isReset 
                  ? 'Insira o e-mail cadastrado para redefinir sua senha corporativa.'
                  : isLogin 
                  ? 'Faça login para gerenciar chamados técnicos e visualizar status.'
                  : 'Registre sua empresa para receber suporte imediato e SLAs otimizados.'}
              </p>
            </div>

            {/* Form Box */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
              {isLoading && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-30 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {/* Status Notifications */}
              {errorMsg && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
              {successMsg && (
                <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-3">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* PASSWORD RESET FORM */}
              {isReset ? (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-gray-300 font-semibold tracking-wider uppercase">E-mail Corporativo</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-gray-500" />
                      <input
                        type="email"
                        required
                        placeholder="seu-nome@suaempresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="reset-email"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-sky-500 hover:bg-sky-400 text-white font-bold rounded-xl text-sm transition-colors cursor-pointer"
                  >
                    Enviar Link de Redefinição
                  </button>

                  <div className="text-center pt-2">
                    <button
                      type="button"
                      onClick={() => { setIsReset(false); setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
                      className="text-xs text-sky-400 hover:underline"
                    >
                      Voltar ao Login
                    </button>
                  </div>
                </form>
              ) : isLogin ? (
                /* LOGIN FORM */
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold tracking-wider uppercase">E-mail Corporativo</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="seu-nome@suaempresa.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="login-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="text-xs text-slate-300 font-semibold tracking-wider uppercase">Senha</label>
                      <button
                        type="button"
                        onClick={() => { setIsReset(true); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-[11px] text-sky-400 hover:underline"
                      >
                        Esqueceu?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="login-password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/15 transition-all cursor-pointer"
                    id="btn-login"
                  >
                    Entrar no Portal
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      Empresa ainda não é cliente?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-sky-400 font-semibold hover:underline"
                        id="btn-switch-to-register"
                      >
                        Criar Cadastro
                      </button>
                    </p>
                  </div>
                </form>
              ) : (
                /* REGISTER/SIGNUP FORM */
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold tracking-wider uppercase">Nome da Empresa</label>
                    <div className="relative">
                      <Building className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Alfa Informática Ltda"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="reg-company"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold tracking-wider uppercase">CNPJ (Apenas números)</label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: 12345678000199"
                        value={cnpj}
                        onChange={(e) => setCnpj(e.target.value.replace(/\D/g, ''))}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="reg-cnpj"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold tracking-wider uppercase">Nome do Responsável / Contato</label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder="Ex: Roberto Ramos"
                        value={representative}
                        onChange={(e) => setRepresentative(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="reg-representative"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold tracking-wider uppercase">E-mail Administrativo</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="email"
                        required
                        placeholder="Ex: contato@empresa.com"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="reg-email"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold tracking-wider uppercase">Crie uma Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3.5 w-4.5 h-4.5 text-slate-500" />
                      <input
                        type="password"
                        required
                        placeholder="Mínimo 6 dígitos"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all"
                        id="reg-password"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold rounded-xl text-sm shadow-lg shadow-sky-500/15 transition-all cursor-pointer"
                    id="btn-register"
                  >
                    Cadastrar Empresa
                  </button>

                  <div className="text-center pt-2">
                    <p className="text-xs text-slate-400">
                      Já possui cadastro corporativo?{' '}
                      <button
                        type="button"
                        onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
                        className="text-sky-400 font-semibold hover:underline"
                        id="btn-switch-to-login"
                      >
                        Entrar no Portal
                      </button>
                    </p>
                  </div>
                </form>
              )}
            </div>

            {/* AnyDesk security badge tip */}
            <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/5 text-slate-400 text-xs flex gap-3 items-start">
              <Shield className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
              <p>Nossos servidores e acessos remotos operam com criptografia AES-256 bits, garantindo total segurança e inviolabilidade dos sistemas da sua empresa.</p>
            </div>
          </div>
        ) : (
          /* PORTAL CLIENTE LOGADO */
          <div className="space-y-8">
            {/* User Header Block */}
            <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-500/15">
                  <Building className="w-7 h-7" />
                </div>
                <div>
                  <h2 className="text-2xl font-display font-bold text-white tracking-tight">
                    {clientProfile ? clientProfile.companyName : 'Painel de Suporte'}
                  </h2>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-sky-400" /> Resp: {clientProfile?.representative || 'Contato'}
                    </span>
                    {clientProfile?.cnpj && (
                      <span className="font-mono">CNPJ: {clientProfile.cnpj}</span>
                    )}
                    <span className="text-sky-400">{user.email}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={onNavigateToTicketForm}
                  className="px-5 py-3 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-semibold text-sm transition-all shadow-lg shadow-sky-500/10 hover:shadow-sky-500/25 flex items-center gap-2 cursor-pointer"
                  id="btn-portal-open-ticket"
                >
                  <PlusCircle className="w-4 h-4" /> Novo Chamado
                </button>
                
                <button
                  onClick={fetchTickets}
                  className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                  title="Atualizar Chamados"
                  id="btn-refresh-tickets"
                >
                  <RefreshCw className={`w-4 h-4 ${loadingTickets ? 'animate-spin' : ''}`} />
                </button>

                <button
                  onClick={onLogout}
                  className="p-3 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 transition-colors"
                  title="Sair da Conta"
                  id="btn-portal-logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Dashboard Workspace */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Side: Tickets List */}
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-display font-bold text-white tracking-tight flex items-center gap-2">
                    <Clipboard className="w-5 h-5 text-sky-400" /> Histórico de Chamados
                  </h3>
                  <span className="text-xs font-mono text-slate-400">{tickets.length} chamados registrados</span>
                </div>

                {loadingTickets ? (
                  <div className="p-12 text-center glass-panel rounded-2xl space-y-3">
                    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="text-sm text-slate-400">Carregando seus chamados...</p>
                  </div>
                ) : tickets.length === 0 ? (
                  <div className="p-12 text-center glass-panel rounded-2xl space-y-4">
                    <Info className="w-12 h-12 text-slate-500 mx-auto" />
                    <div className="space-y-1">
                      <h4 className="text-base font-bold text-white">Nenhum chamado aberto</h4>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">Sua empresa não possui chamados ativos no momento. Clique em "Novo Chamado" caso precise de suporte técnico remoto.</p>
                    </div>
                    <button
                      onClick={onNavigateToTicketForm}
                      className="px-4 py-2.5 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 text-sky-400 transition-colors"
                    >
                      Abrir Chamado Agora
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {tickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`p-4 rounded-xl border text-left cursor-pointer transition-all duration-200 ${
                          selectedTicket?.id === ticket.id
                            ? 'bg-sky-500/5 border-sky-500/40'
                            : 'bg-white/5 border-white/5 hover:border-white/15'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <span className="text-[10px] font-mono text-slate-500 uppercase block">ID: {ticket.id.slice(0, 8)}...</span>
                            <h4 className="text-sm font-bold text-white line-clamp-1 font-display">
                              {ticket.employeeName} - {ticket.role}
                            </h4>
                            <p className="text-xs text-slate-400 line-clamp-1">
                              {ticket.description}
                            </p>
                          </div>
                          <div className="text-right shrink-0 space-y-1.5">
                            {getStatusBadge(ticket.status)}
                            <div className="text-[10px] text-slate-500 font-sans block">{formatDate(ticket.createdAt)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Side: Ticket Detail Viewer */}
              <div className="lg:col-span-5">
                <AnimatePresence mode="wait">
                  {selectedTicket ? (
                    <motion.div
                      key={selectedTicket.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="glass-panel border border-white/10 rounded-2xl p-6 space-y-6 text-left"
                    >
                      <div className="border-b border-white/5 pb-4 space-y-2">
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[10px] font-mono text-slate-500 block uppercase">Chamado ID: {selectedTicket.id}</span>
                            <h3 className="text-lg font-bold text-white font-display">Detalhes da Solicitação</h3>
                          </div>
                          {getStatusBadge(selectedTicket.status)}
                        </div>
                        <div className="flex gap-x-4 text-xs text-slate-400 pt-1">
                          <span>Prioridade: {getPriorityBadge(selectedTicket.priority)}</span>
                          <span>Suporte por AnyDesk: {selectedTicket.anydesk ? 'Sim' : 'Não'}</span>
                        </div>
                      </div>

                      {/* Problem Description block */}
                      <div className="space-y-2">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Problema Reportado</span>
                        <div className="p-4 rounded-xl bg-slate-900/50 border border-white/5 text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-wrap">
                          {selectedTicket.description}
                        </div>
                        <div className="text-[10px] text-slate-500 font-sans">
                          Aberto em: {formatDate(selectedTicket.createdAt)} por {selectedTicket.employeeName} ({selectedTicket.role})
                        </div>
                      </div>

                      {/* Technical Response block */}
                      <div className="space-y-3 pt-2 border-t border-white/5">
                        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Acompanhamento do Suporte</span>
                        
                        {selectedTicket.response ? (
                          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sm text-slate-200 leading-relaxed font-sans space-y-2 relative">
                            <span className="absolute top-3 right-3 text-[9px] font-mono bg-sky-500/20 text-sky-400 border border-sky-500/30 px-1 py-0.2 rounded">TÉCNICO</span>
                            <p className="font-semibold text-sky-400 mb-1 flex items-center gap-1.5 text-xs">
                              <Cpu className="w-3.5 h-3.5" /> Resposta da Central de TI
                            </p>
                            <p className="text-xs text-slate-300 font-sans whitespace-pre-wrap">
                              {selectedTicket.response}
                            </p>
                            <div className="text-[10px] text-slate-500 pt-1 text-right">
                              Atualizado em: {formatDate(selectedTicket.updatedAt)}
                            </div>
                          </div>
                        ) : (
                          <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-xs text-yellow-400 flex gap-3.5 items-start">
                            <Clock className="w-5 h-5 shrink-0 mt-0.5 animate-pulse" />
                            <div>
                              <strong className="block font-semibold">Aguardando Técnico:</strong>
                              <span>Seu chamado já está na fila de atendimento e um especialista está analisando os logs do problema para entrar em contato.</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="glass-panel border border-white/5 border-dashed rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center space-y-4">
                      <Clipboard className="w-12 h-12 text-slate-600" />
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-slate-300">Nenhum chamado selecionado</h4>
                        <p className="text-xs text-slate-500 max-w-xs mx-auto">Selecione um chamado da lista lateral para visualizar as atualizações, notas técnicas e respostas de suporte.</p>
                      </div>
                    </div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
