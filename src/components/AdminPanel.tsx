import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShieldAlert, Cpu, Clipboard, RefreshCw, MessageSquare, Trash2, Edit2, 
  Search, Filter, CheckCircle, AlertTriangle, AlertCircle, Clock, Save, X, Eye, 
  User, Building, Phone, Mail, HelpCircle, Star, Laptop, ArrowUpRight
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, 
  query, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { SupportTicket, CustomerReview } from '../types';

export default function AdminPanel() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(false);

  // Filter/Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [companyFilter, setCompanyFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');

  // Active view tabs: 'tickets' | 'reviews' | 'dashboard'
  const [activeTab, setActiveTab] = useState<'tickets' | 'reviews'>('tickets');

  // Selected entities for actions
  const [editingTicket, setEditingTicket] = useState<SupportTicket | null>(null);
  const [adminResponse, setAdminResponse] = useState('');
  const [ticketStatus, setTicketStatus] = useState<SupportTicket['status']>('received');
  const [submittingChange, setSubmittingChange] = useState(false);

  // General Status notifications
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoadingTickets(true);
    setLoadingReviews(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      // 1. Fetch all tickets
      const ticketsRef = collection(db, 'tickets');
      const ticketsQuery = query(ticketsRef, orderBy('createdAt', 'desc'));
      const ticketsSnapshot = await getDocs(ticketsQuery);
      const fetchedTickets: SupportTicket[] = [];
      ticketsSnapshot.forEach((doc) => {
        fetchedTickets.push({ id: doc.id, ...doc.data() } as SupportTicket);
      });
      setTickets(fetchedTickets);

      // 2. Fetch all reviews
      const reviewsRef = collection(db, 'reviews');
      const reviewsQuery = query(reviewsRef, orderBy('createdAt', 'desc'));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const fetchedReviews: CustomerReview[] = [];
      reviewsSnapshot.forEach((doc) => {
        fetchedReviews.push({ id: doc.id, ...doc.data() } as CustomerReview);
      });
      setReviews(fetchedReviews);

    } catch (err) {
      console.error("Error fetching admin database resources:", err);
      setErrorMsg("Ocorreu um erro ao carregar os dados. Verifique as credenciais administrativas.");
    } finally {
      setLoadingTickets(false);
      setLoadingReviews(false);
    }
  };

  const handleUpdateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTicket) return;

    setSubmittingChange(true);
    setErrorMsg('');
    setSuccessMsg('');

    try {
      const ticketRef = doc(db, 'tickets', editingTicket.id);
      await updateDoc(ticketRef, {
        status: ticketStatus,
        response: adminResponse.trim(),
        updatedAt: serverTimestamp(),
      });

      // Update local state smoothly
      setTickets((prev) => 
        prev.map((t) => 
          t.id === editingTicket.id 
            ? { ...t, status: ticketStatus, response: adminResponse, updatedAt: new Date() } 
            : t
        )
      );

      setSuccessMsg(`Chamado de ${editingTicket.companyName} atualizado com sucesso!`);
      setEditingTicket(null);
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.UPDATE, `tickets/${editingTicket.id}`);
      } catch (formattedErr: any) {
        setErrorMsg("Erro de permissão no Firestore. Apenas administradores autenticados podem efetuar alterações.");
      }
    } finally {
      setSubmittingChange(false);
    }
  };

  const handleDeleteTicket = async (ticketId: string) => {
    if (!window.confirm("Deseja realmente excluir este chamado definitivamente do banco de dados?")) return;

    setErrorMsg('');
    setSuccessMsg('');

    try {
      await deleteDoc(doc(db, 'tickets', ticketId));
      setTickets((prev) => prev.filter((t) => t.id !== ticketId));
      setSuccessMsg("Chamado removido definitivamente.");
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `tickets/${ticketId}`);
      } catch (formattedErr: any) {
        setErrorMsg("Erro de permissão. Somente administradores autorizados.");
      }
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!window.confirm("Deseja excluir esta avaliação permanentemente?")) return;

    setErrorMsg('');
    setSuccessMsg('');

    try {
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews((prev) => prev.filter((r) => r.id !== reviewId));
      setSuccessMsg("Avaliação excluída com sucesso.");
    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.DELETE, `reviews/${reviewId}`);
      } catch (formattedErr: any) {
        setErrorMsg("Erro de permissão para excluir avaliações.");
      }
    }
  };

  const startEditTicket = (ticket: SupportTicket) => {
    setEditingTicket(ticket);
    setAdminResponse(ticket.response || '');
    setTicketStatus(ticket.status);
  };

  // Compute stats metrics dynamically
  const totalTicketsCount = tickets.length;
  const pendingTicketsCount = tickets.filter(t => t.status !== 'completed').length;
  const completedTicketsCount = tickets.filter(t => t.status === 'completed').length;
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  // Apply search query & filters
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch = 
      t.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCompany = companyFilter === '' || t.companyName === companyFilter;
    const matchesStatus = statusFilter === '' || t.status === statusFilter;
    const matchesPriority = priorityFilter === '' || t.priority === priorityFilter;

    return matchesSearch && matchesCompany && matchesStatus && matchesPriority;
  });

  // Extract list of unique company names for company filtering dropdown
  const uniqueCompanies = Array.from(new Set(tickets.map((t) => t.companyName)));

  const getStatusBadge = (status: SupportTicket['status']) => {
    const configs = {
      received: { label: 'Recebido', color: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30' },
      analyzing: { label: 'Em Análise', color: 'bg-purple-500/15 text-purple-400 border-purple-500/30' },
      in_progress: { label: 'Em Atendimento', color: 'bg-sky-500/15 text-sky-400 border-sky-500/30' },
      completed: { label: 'Finalizado', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
    };
    const config = configs[status] || configs.received;
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: SupportTicket['priority']) => {
    const configs = {
      low: { label: 'Baixa', color: 'bg-slate-500/10 text-slate-400 border-slate-500/20' },
      medium: { label: 'Média', color: 'bg-sky-500/10 text-sky-400 border-sky-500/20' },
      high: { label: 'Alta', color: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
      urgent: { label: 'Urgente', color: 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse' },
    };
    const config = configs[priority] || configs.medium;
    return (
      <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${config.color}`}>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
        
        {/* Admin Title Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3.5 rounded-2xl bg-sky-500/10 text-sky-400 shadow-lg shadow-sky-500/5">
              <Cpu className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <h1 className="text-2xl font-display font-bold text-white tracking-tight flex items-center gap-2">
                Painel Administrativo de TI <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded-md font-mono">MODO SUPORTE</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">Gerenciamento centralizado de incidentes, SLAs corporativos e avaliações de qualidade.</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchData}
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-colors text-sm flex items-center gap-2 cursor-pointer"
              id="admin-btn-refresh"
            >
              <RefreshCw className={`w-4 h-4 ${(loadingTickets || loadingReviews) ? 'animate-spin' : ''}`} /> Atualizar Banco
            </button>
          </div>
        </div>

        {/* Dashboard Cards Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl glass-panel text-left space-y-1 border border-white/5">
            <span className="text-xs text-slate-400 uppercase font-mono">Chamados Recebidos</span>
            <div className="text-2xl font-bold text-white font-display">{totalTicketsCount}</div>
            <p className="text-[10px] text-slate-500">Histórico de chamados salvos</p>
          </div>
          <div className="p-5 rounded-2xl glass-panel text-left space-y-1 border border-white/5">
            <span className="text-xs text-yellow-400 uppercase font-mono">Pendentes / Ativos</span>
            <div className="text-2xl font-bold text-yellow-400 font-display">{pendingTicketsCount}</div>
            <p className="text-[10px] text-slate-500">Aguardando solução técnica</p>
          </div>
          <div className="p-5 rounded-2xl glass-panel text-left space-y-1 border border-white/5">
            <span className="text-xs text-green-400 uppercase font-mono">Chamados Finalizados</span>
            <div className="text-2xl font-bold text-green-400 font-display">{completedTicketsCount}</div>
            <p className="text-[10px] text-slate-500">Ocorrências resolvidas</p>
          </div>
          <div className="p-5 rounded-2xl glass-panel text-left space-y-1 border border-white/5">
            <span className="text-xs text-sky-400 uppercase font-mono font-sans flex items-center gap-1">Média de Avaliações <Star className="w-3 h-3 fill-yellow-400 stroke-yellow-400" /></span>
            <div className="text-2xl font-bold text-white font-display">{averageRating} / 5.0</div>
            <p className="text-[10px] text-slate-500">Baseado em {reviews.length} depoimentos</p>
          </div>
        </div>

        {/* Dynamic Alerts */}
        {errorMsg && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}
        {successMsg && (
          <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm flex items-center gap-3">
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Tabs switcher */}
        <div className="flex border-b border-white/5 gap-2">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`px-5 py-3.5 font-sans font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tickets'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Clipboard className="w-4.5 h-4.5" /> Chamados de TI ({filteredTickets.length})
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-5 py-3.5 font-sans font-bold text-sm tracking-wide border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'reviews'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4.5 h-4.5" /> Moderação de Avaliações ({reviews.length})
          </button>
        </div>

        {/* WORKSPACE CONTENT */}
        <AnimatePresence mode="wait">
          {activeTab === 'tickets' ? (
            <motion.div
              key="tickets-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {/* Filters Panel */}
              <div className="p-5 rounded-2xl glass-panel border border-white/5 grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                {/* Search query */}
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4.5 h-4.5 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Pesquisar por empresa, erro..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white placeholder-slate-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                    id="search-input"
                  />
                </div>

                {/* Filter by Company */}
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-slate-500" />
                  <select
                    value={companyFilter}
                    onChange={(e) => setCompanyFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                    id="filter-company"
                  >
                    <option value="">Todas as Empresas</option>
                    {uniqueCompanies.map((comp, idx) => (
                      <option key={idx} value={comp}>{comp}</option>
                    ))}
                  </select>
                </div>

                {/* Filter by Status */}
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-slate-500" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                    id="filter-status"
                  >
                    <option value="">Todos os Status</option>
                    <option value="received">Recebido</option>
                    <option value="analyzing">Em Análise</option>
                    <option value="in_progress">Em Atendimento</option>
                    <option value="completed">Finalizado</option>
                  </select>
                </div>

                {/* Filter by Priority */}
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-slate-500" />
                  <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                    id="filter-priority"
                  >
                    <option value="">Todas as Prioridades</option>
                    <option value="low">Baixa</option>
                    <option value="medium">Média</option>
                    <option value="high">Alta</option>
                    <option value="urgent">Urgente</option>
                  </select>
                </div>
              </div>

              {/* Tickets Table / List Layout */}
              {loadingTickets ? (
                <div className="p-16 text-center glass-panel rounded-2xl border border-white/5">
                  <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 text-sm">Carregando todos os chamados da empresa...</p>
                </div>
              ) : filteredTickets.length === 0 ? (
                <div className="p-16 text-center glass-panel rounded-2xl space-y-3 border border-white/5">
                  <Clipboard className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">Nenhum chamado corresponde aos filtros</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">Tente alterar os termos de busca ou remover as restrições selecionadas acima.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredTickets.map((ticket) => (
                    <div 
                      key={ticket.id} 
                      className="p-5 rounded-2xl glass-panel border border-white/10 text-left hover:border-sky-500/20 transition-all flex flex-col lg:flex-row justify-between gap-6"
                    >
                      {/* Ticket Summary Info */}
                      <div className="space-y-4 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span className="text-[10px] font-mono text-slate-500 bg-white/5 border border-white/10 px-2 py-0.5 rounded">
                            ID: {ticket.id}
                          </span>
                          {getStatusBadge(ticket.status)}
                          {getPriorityBadge(ticket.priority)}
                          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-slate-500" /> {formatDate(ticket.createdAt)}
                          </span>
                        </div>

                        <div className="space-y-1.5">
                          <h3 className="text-lg font-bold text-white font-display flex items-center gap-2">
                            <Building className="w-4.5 h-4.5 text-sky-400" /> {ticket.companyName}
                          </h3>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-500" /> {ticket.employeeName} ({ticket.role})</span>
                            <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-slate-500" /> {ticket.whatsapp}</span>
                            <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-slate-500" /> {ticket.email}</span>
                          </div>
                        </div>

                        {/* Description content */}
                        <div className="space-y-1">
                          <span className="text-[10px] text-slate-400 font-mono uppercase block">Relato Técnico:</span>
                          <p className="text-sm text-gray-200 leading-relaxed font-sans bg-slate-950/50 p-4 rounded-xl border border-white/5 whitespace-pre-wrap">
                            {ticket.description}
                          </p>
                        </div>

                        {/* If Support response exists */}
                        {ticket.response && (
                          <div className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-slate-200 leading-relaxed space-y-1.5">
                            <p className="font-bold text-sky-400 flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                              <CheckCircle className="w-3.5 h-3.5" /> Resposta Técnica Atual:
                            </p>
                            <p className="font-sans text-xs text-slate-300 whitespace-pre-wrap">
                              {ticket.response}
                            </p>
                            <p className="text-[10px] text-slate-500 text-right">Ultimo acompanhamento: {formatDate(ticket.updatedAt)}</p>
                          </div>
                        )}
                      </div>

                      {/* Administrative Actions */}
                      <div className="lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-white/5 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between gap-4">
                        <div className="space-y-2.5">
                          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Ações do Administrador</span>
                          
                          <button
                            onClick={() => startEditTicket(ticket)}
                            className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Responder / Alterar Status
                          </button>

                          <button
                            onClick={() => handleDeleteTicket(ticket.id)}
                            className="w-full py-2.5 rounded-xl bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600/20 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Excluir Chamado
                          </button>
                        </div>

                        {/* AnyDesk info indicator */}
                        <div className="p-3 rounded-xl bg-white/5 border border-white/5 text-[11px] text-slate-400 flex items-center gap-2.5">
                          <Laptop className="w-4 h-4 text-sky-400 shrink-0" />
                          <span>AnyDesk Remoto: <strong>{ticket.anydesk ? 'Sim, possui' : 'Não / Baixar'}</strong></span>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ) : (
            /* REVIEWS TAB MODERATION */
            <motion.div
              key="reviews-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-6"
            >
              {loadingReviews ? (
                <div className="p-16 text-center glass-panel rounded-2xl border border-white/5">
                  <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-slate-400 text-sm">Carregando depoimentos corporativos...</p>
                </div>
              ) : reviews.length === 0 ? (
                <div className="p-16 text-center glass-panel rounded-2xl space-y-3 border border-white/5">
                  <MessageSquare className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="text-base font-bold text-white">Nenhum depoimento no banco de dados</h4>
                  <p className="text-xs text-slate-500">Avaliações enviadas por clientes logados serão exibidas nesta central.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {reviews.map((rev) => (
                    <div 
                      key={rev.id}
                      className="p-5 rounded-2xl glass-panel border border-white/10 text-left flex flex-col justify-between gap-4 relative"
                    >
                      <button
                        onClick={() => handleDeleteReview(rev.id)}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-red-600/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                        title="Excluir Avaliação"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="space-y-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-sky-500/10">
                            {rev.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-white font-display">{rev.name}</h4>
                            <p className="text-[11px] text-slate-400">{rev.companyName}</p>
                          </div>
                        </div>

                        {/* Star display */}
                        <div className="flex gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${
                                i < rev.rating 
                                  ? 'fill-yellow-400 stroke-yellow-400' 
                                  : 'stroke-slate-600'
                              }`} 
                            />
                          ))}
                        </div>

                        <p className="text-xs text-slate-300 italic leading-relaxed font-sans">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="text-[10px] text-slate-500 font-mono text-right pt-2 border-t border-white/5">
                        Enviado em: {formatDate(rev.createdAt)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* DIALOG/MODAL FOR EDITING AND RESPONDING TICKETS */}
        <AnimatePresence>
          {editingTicket && (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-xl glass-panel border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl relative"
              >
                {submittingChange && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-30 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-xs text-slate-400 font-mono">Salvando alterações...</span>
                  </div>
                )}

                <div className="flex justify-between items-start border-b border-white/5 pb-4 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white font-display">Atualizar Ticket de Suporte</h3>
                    <p className="text-xs text-slate-400 mt-1">Empresa: {editingTicket.companyName} | Resp: {editingTicket.employeeName}</p>
                  </div>
                  <button 
                    onClick={() => setEditingTicket(null)}
                    className="p-2 rounded-lg bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleUpdateTicket} className="space-y-4 text-left">
                  {/* Select status */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Status do Atendimento</label>
                    <select
                      value={ticketStatus}
                      onChange={(e: any) => setTicketStatus(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white text-xs focus:outline-none focus:border-sky-500"
                    >
                      <option value="received">Recebido (Aguardando Fila)</option>
                      <option value="analyzing">Em Análise (Verificando Logs)</option>
                      <option value="in_progress">Em Atendimento (Ativo na Tela)</option>
                      <option value="completed">Finalizado (Erro Sanado)</option>
                    </select>
                  </div>

                  {/* Admin notes response */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider block">Resposta do Suporte Técnico</label>
                    <textarea
                      rows={5}
                      required
                      placeholder="Descreva as ações técnicas executadas ou instruções de download/configuração para o usuário visualizar em seu painel..."
                      value={adminResponse}
                      onChange={(e) => setAdminResponse(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs"
                    />
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingTicket(null)}
                      className="flex-1 py-3 border border-white/10 text-slate-300 hover:bg-white/5 font-semibold text-xs rounded-xl transition-all"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-3 bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" /> Salvar Alterações
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
