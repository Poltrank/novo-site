import { motion } from 'motion/react';
import { Zap, Monitor, Lock, PhoneCall, Building2, Cloud, Wrench, Star } from 'lucide-react';

export default function WhyChooseUs() {
  const cards = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Atendimento Rápido',
      description: 'Tempo médio de resposta inferior a 15 minutos. Abrimos o chamado e entramos em ação sem demoras.',
      color: 'from-amber-500/20 to-orange-500/10 text-amber-400',
    },
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Suporte Remoto Especializado',
      description: 'Acesso seguro por criptografia. Resolvemos bugs, panes e configurações diretamente na sua tela.',
      color: 'from-sky-500/20 to-indigo-500/10 text-sky-400',
    },
    {
      icon: <Lock className="w-6 h-6" />,
      title: 'Segurança no Atendimento',
      description: 'Garantia total de sigilo de dados e conformidade com as melhores práticas de cibersegurança.',
      color: 'from-green-500/20 to-emerald-500/10 text-green-400',
    },
    {
      icon: <PhoneCall className="w-6 h-6" />,
      title: 'Comunicação Fácil',
      description: 'Sem burocracias. Atendimento facilitado via WhatsApp, e-mail ou portal, com técnicos diretos.',
      color: 'from-cyan-500/20 to-teal-500/10 text-cyan-400',
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Foco 100% Corporativo',
      description: 'Entendemos o fluxo de trabalho de empresas. Nossas soluções são desenhadas para o mercado corporativo.',
      color: 'from-purple-500/20 to-pink-500/10 text-purple-400',
    },
    {
      icon: <Cloud className="w-6 h-6" />,
      title: 'Tudo Realizado Online',
      description: 'Instalação, configuração de nuvem, rede ou reparo de software. Sem necessidade de visitas físicas demoradas.',
      color: 'from-sky-500/20 to-indigo-500/10 text-sky-400',
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      title: 'Solução Eficiente',
      description: 'Foco no diagnóstico definitivo do problema para evitar que a mesma falha ocorra novamente.',
      color: 'from-indigo-500/20 to-violet-500/10 text-indigo-400',
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Alto Índice de Satisfação',
      description: 'Clientes corporativos satisfeitos com a qualidade, velocidade e presteza nos nossos atendimentos.',
      color: 'from-rose-500/20 to-red-500/10 text-rose-400',
    },
  ];

  return (
    <section id="why-us" className="py-24 relative overflow-hidden bg-slate-900">
      {/* Visual background accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
            Nossos Diferenciais
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Por que Escolher Nossos Serviços de Suporte?
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-indigo-400 mx-auto rounded-full" />
          <p className="text-slate-400 font-sans">
            Garantimos as melhores práticas em suporte computacional corporativo para manter sua empresa focada apenas no crescimento, sem dores de cabeça com tecnologia.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.05 }}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-sky-500/20 shadow-xl transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                {/* Icon block with custom glow */}
                <div className={`p-3 rounded-xl bg-gradient-to-br ${card.color} w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {card.icon}
                </div>
                
                <h3 className="text-lg font-bold text-white mb-2 font-display tracking-tight group-hover:text-sky-400 transition-colors">
                  {card.title}
                </h3>
                
                <p className="text-sm text-slate-400 leading-relaxed font-sans">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
