import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ClipboardList, CheckCircle, AlertTriangle, ArrowRight, Download, Laptop, Building, 
  User, Mail, Phone, Briefcase, AlertCircle, FileText 
} from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { User as FirebaseUser } from 'firebase/auth';

interface TicketFormProps {
  user: FirebaseUser | null;
  clientProfile: any | null;
  onSuccess: () => void;
}

export default function TicketForm({ user, clientProfile, onSuccess }: TicketFormProps) {
  const [companyName, setCompanyName] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [anydesk, setAnydesk] = useState<boolean | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Prepopulate form if user is logged in
  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
    }
    if (clientProfile) {
      setCompanyName(clientProfile.companyName || '');
      setEmployeeName(clientProfile.representative || '');
      setWhatsapp(clientProfile.whatsapp || '');
      setRole('Responsável TI / Contato');
    }
  }, [user, clientProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (anydesk === null) {
      setErrorMessage('Por favor, informe se utiliza o AnyDesk para acesso remoto.');
      return;
    }

    if (description.trim().length < 10) {
      setErrorMessage('A descrição do problema deve conter pelo menos 10 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    const ticketData = {
      companyName: companyName.trim(),
      employeeName: employeeName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      role: role.trim(),
      description: description.trim(),
      priority,
      anydesk,
      status: 'received',
      clientId: user ? user.uid : '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    try {
      const ticketsRef = collection(db, 'tickets');
      await addDoc(ticketsRef, ticketData);
      
      setSubmitSuccess(true);
      // Reset form
      if (!user) {
        setCompanyName('');
        setEmployeeName('');
        setEmail('');
        setWhatsapp('');
        setRole('');
      }
      setDescription('');
      setAnydesk(null);
      setPriority('medium');
      
      // Call callback after 3 seconds or trigger in UI
      setTimeout(() => {
        setSubmitSuccess(false);
        if (onSuccess) onSuccess();
      }, 4000);

    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, 'tickets');
      } catch (formattedErr: any) {
        setErrorMessage('Ocorreu um erro ao enviar o chamado. Por favor, tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ticket-form" className="py-24 relative bg-slate-950 overflow-hidden min-h-screen flex items-center">
      {/* Visual background accents */}
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
          <div className="inline-flex p-3 rounded-2xl bg-sky-500/10 text-sky-400 mb-2">
            <ClipboardList className="w-8 h-8" />
          </div>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Abertura de Chamado Técnico
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-sans">
            Preencha os dados abaixo detalhando o problema. Nossa central remota iniciará o diagnóstico imediatamente.
          </p>
        </div>

        {/* Outer Form Container */}
        <div className="glass-panel border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative">
          
          <AnimatePresence mode="wait">
            {submitSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-12 space-y-6 flex flex-col items-center justify-center"
                key="success"
              >
                <div className="p-4 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 animate-bounce">
                  <CheckCircle className="w-16 h-16" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h3 className="text-2xl font-display font-bold text-white">
                    Chamado Enviado com Sucesso!
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Sua solicitação já foi registrada em nosso sistema. Um técnico de suporte entrará em contato via WhatsApp ou e-mail nos próximos minutos.
                  </p>
                </div>
                
                {anydesk === false && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-4 rounded-xl bg-sky-500/10 border border-sky-500/20 text-left text-sm max-w-md space-y-3"
                  >
                    <div className="flex items-center gap-2 text-sky-400 font-semibold">
                      <Download className="w-4 h-4" />
                      <span>Instalação do AnyDesk Necessária</span>
                    </div>
                    <p className="text-xs text-slate-300">
                      Como você selecionou que não utiliza o AnyDesk, clique no botão abaixo para baixar a versão segura oficial para podermos realizar o suporte remoto.
                    </p>
                    <a
                      href="https://anydesk.com/pt/downloads"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-xs font-semibold text-white transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" /> Baixar AnyDesk Oficial
                    </a>
                  </motion.div>
                )}
                
                <p className="text-xs text-slate-500 animate-pulse font-mono">
                  Redirecionando em instantes...
                </p>
              </motion.div>
            ) : (
              <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
                key="form"
              >
                {/* Form Errors */}
                {errorMessage && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Submitting indicator */}
                {isSubmitting && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm rounded-3xl z-30 flex flex-col items-center justify-center gap-4">
                    <div className="w-10 h-10 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-sm text-slate-400 font-mono">Processando seu chamado...</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Company Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Building className="w-3.5 h-3.5 text-sky-400" /> Nome da Empresa
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Alfa Soluções Digitais"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                      id="ticket-company-name"
                    />
                  </div>

                  {/* Employee Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <User className="w-3.5 h-3.5 text-sky-400" /> Seu Nome completo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Carlos Silva"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                      id="ticket-employee-name"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-sky-400" /> E-mail Corporativo
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="Ex: contato@alfa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                      id="ticket-email"
                    />
                  </div>

                  {/* WhatsApp */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-sky-400" /> WhatsApp com DDD
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="Ex: 11999999999"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                      id="ticket-whatsapp"
                    />
                  </div>

                  {/* Role */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-sky-400" /> Seu Cargo
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Analista de Vendas"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                      id="ticket-role"
                    />
                  </div>

                  {/* Priority level */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-sky-400" /> Prioridade do Atendimento
                    </label>
                    <select
                      value={priority}
                      onChange={(e: any) => setPriority(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                      id="ticket-priority"
                    >
                      <option value="low">Baixa (Dúvidas, ajustes leves)</option>
                      <option value="medium">Média (Erros locais, programas falhando)</option>
                      <option value="high">Alta (Rede lenta, impressora principal off)</option>
                      <option value="urgent">Urgente (Servidor inoperante, sistema fora)</option>
                    </select>
                  </div>
                </div>

                {/* Problem Description */}
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <FileText className="w-3.5 h-3.5 text-sky-400" /> Descrição detalhada do problema
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Descreva detalhadamente o erro ocorrido (Ex: Ao abrir o Outlook, aparece uma caixa de erro de conexão com servidor Exchange; internet funcionando normal, demais computadores acessando normal...)"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all text-sm"
                    id="ticket-description"
                  />
                  <p className="text-[10px] text-slate-500 text-right">Mínimo 10 caracteres. Evite colocar senhas ou credenciais confidenciais.</p>
                </div>

                {/* AnyDesk Check */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/5 space-y-4">
                  <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-indigo-400" /> Acesso Remoto
                  </span>
                  <p className="text-xs text-slate-400">
                    Nossa equipe realiza o suporte diretamente na sua máquina através do AnyDesk. Você possui o AnyDesk instalado?
                  </p>
                  
                  <div className="flex gap-4">
                    <button
                      type="button"
                      onClick={() => setAnydesk(true)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                        anydesk === true
                          ? 'bg-sky-500/20 text-sky-400 border-sky-500'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                      id="btn-anydesk-yes"
                    >
                      Sim, já utilizo o AnyDesk
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnydesk(false)}
                      className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                        anydesk === false
                          ? 'bg-amber-600/20 text-amber-400 border-amber-500'
                          : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10'
                      }`}
                      id="btn-anydesk-no"
                    >
                      Não tenho ou não sei
                    </button>
                  </div>

                  <AnimatePresence>
                    {anydesk === false && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex gap-3.5 items-start mt-2"
                      >
                        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                          <strong className="block font-semibold">Aviso Importante:</strong>
                          <span>Será necessário instalar o AnyDesk para podermos efetuar o suporte remoto. Após enviar este chamado, daremos as instruções e link oficial para download seguro.</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold tracking-wide text-sm shadow-xl shadow-sky-500/15 hover:shadow-sky-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  id="btn-submit-ticket"
                >
                  Enviar Chamado Técnico <ArrowRight className="w-4 h-4" />
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
