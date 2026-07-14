import { motion } from 'motion/react';
import { Phone, Mail, Clock, MessageSquare, ArrowUpRight, ShieldCheck } from 'lucide-react';

export default function Contact() {
  const whatsappNumber = '5511999999999'; // Simulated corporate WhatsApp
  const contactEmail = 'suporte@nexustecnologia.com';

  const channels = [
    {
      icon: <Phone className="w-6 h-6 text-sky-400" />,
      title: 'WhatsApp Central de TI',
      value: '+55 11 99999-9999',
      description: 'Atendimento instantâneo e triagem de urgências técnicas.',
      link: `https://wa.me/${whatsappNumber}?text=Olá,%20gostaria%20de%20solicitar%20suporte%20técnico%20remoto%20para%20minha%20empresa.`,
      btnText: 'Conversar via WhatsApp',
    },
    {
      icon: <Mail className="w-6 h-6 text-indigo-400" />,
      title: 'E-mail Corporativo',
      value: contactEmail,
      description: 'Envio de logs, propostas comerciais e contratos corporativos.',
      link: `mailto:${contactEmail}`,
      btnText: 'Enviar um E-mail',
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-300" />,
      title: 'Horário de Atendimento',
      value: 'Segunda a Sexta: 08h às 18h',
      description: 'Plantão aos finais de semana para empresas com SLA avançado contratado.',
      link: null,
      btnText: 'SLA Ativo',
    },
  ];

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-slate-950">
      {/* Decorative gradients */}
      <div className="absolute top-1/4 right-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Title */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
            Canais de Atendimento
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Fale com Nossa Central Remota
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-indigo-400 mx-auto rounded-full" />
          <p className="text-slate-400 font-sans">
            Sua infraestrutura de informática não pode parar. Entre em contato pelos canais oficiais ou utilize nossa abertura ágil de chamados.
          </p>
        </div>

        {/* Channels Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {channels.map((ch, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/20 transition-all flex flex-col justify-between text-left group"
            >
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-white/5 w-fit group-hover:scale-105 transition-transform duration-300">
                  {ch.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white font-display tracking-tight">{ch.title}</h3>
                  <p className="text-lg font-bold text-sky-300 font-sans tracking-tight break-all">{ch.value}</p>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">{ch.description}</p>
              </div>

              <div className="pt-6 mt-6 border-t border-white/5">
                {ch.link ? (
                  <a
                    href={ch.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-sky-500 hover:text-white border border-white/10 text-slate-300 font-semibold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer group"
                  >
                    {ch.btnText} <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                ) : (
                  <div className="w-full py-3 px-4 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold text-xs flex items-center justify-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5" /> Atendimento Ativo
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* SLA and Security statement bottom bar */}
        <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-white/15 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1 max-w-2xl">
            <h4 className="text-base font-bold text-white font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-sky-400" /> Segurança e Sigilo Homologados
            </h4>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              Todos os computadores da sua empresa contam com Termo de Sigilo de Dados e Confidencialidade Técnico-Corporativa. Nossos softwares de acesso remoto geram senhas de uso único por conexão, garantindo que você possua o controle integral das sessões de suporte técnico.
            </p>
          </div>
          <a
            href={`https://wa.me/${whatsappNumber}?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20os%20planos%20mensais%20de%20suporte%20TI.`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer h-fit shrink-0"
          >
            <MessageSquare className="w-4 h-4" /> Solicitar Atendimento Mensal
          </a>
        </div>

      </div>
    </section>
  );
}
