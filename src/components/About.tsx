import { motion } from 'motion/react';
import { UserCheck, Shield, Clock, Eye, Briefcase, Zap } from 'lucide-react';

export default function About() {
  const highlights = [
    {
      icon: <UserCheck className="w-6 h-6 text-sky-400" />,
      title: 'Técnico Especializado',
      description: 'Especialista em TI com anos de experiência em infraestrutura e suporte computacional corporativo.',
    },
    {
      icon: <Zap className="w-6 h-6 text-sky-400" />,
      title: 'Agilidade Operacional',
      description: 'Trabalho focado em diagnosticar e solucionar problemas de forma ágil, reduzindo gargalos técnicos.',
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-400" />,
      title: 'Tempo Parado Mínimo',
      description: 'Foco total em mitigar interrupções para que a produtividade da sua empresa continue intacta.',
    },
  ];

  return (
    <section id="about" className="py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Presentation text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
                Quem Somos
              </span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
                Foco Total em Manter Sua <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                  Operação Sem Interrupções
                </span>
              </h2>
            </div>

            <p className="text-slate-300 leading-relaxed text-lg">
              Sou profissional especializado em suporte de TI e informática voltado exclusivamente para atender as demandas do mercado corporativo. Compreendo que na era digital, cada minuto que a sua infraestrutura técnica fica paralisada representa custos e atrasos para os negócios.
            </p>

            <div className="space-y-4 text-slate-400">
              <p className="leading-relaxed">
                Meu serviço atua de forma <strong>totalmente online e remota</strong>, possibilitando intervenções imediatas sem que sua empresa precise esperar por deslocamentos físicos. Agilidade, excelência técnica e máxima transparência constituem os pilares da minha metodologia de trabalho.
              </p>
              <p className="leading-relaxed">
                Aqui, cada organização recebe um <strong>atendimento altamente personalizado</strong>. Seja no gerenciamento de redes, na prevenção de invasões ou no suporte diário a colaboradores, meu compromisso reside em zerar problemas de TI e otimizar os fluxos de trabalho do seu time.
              </p>
            </div>

            <div className="pt-4 flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-sky-600 flex items-center justify-center text-xs font-bold text-white">N</div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-indigo-600 flex items-center justify-center text-xs font-bold text-white">E</div>
                <div className="w-10 h-10 rounded-full border-2 border-slate-950 bg-sky-500 flex items-center justify-center text-xs font-bold text-white">X</div>
              </div>
              <div>
                <span className="text-sm font-bold text-white block">Equipe Técnica Certificada</span>
                <span className="text-xs text-slate-400">Especialistas prontos para te atender</span>
              </div>
            </div>
          </div>

          {/* Right Column - Highlight Cards Grid */}
          <div className="lg:col-span-5 grid grid-cols-1 gap-6">
            {highlights.map((hl, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: 25 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-6 rounded-2xl glass-panel hover:border-sky-500/30 transition-all duration-300 flex gap-5 group"
              >
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400 h-fit group-hover:scale-110 transition-transform duration-300">
                  {hl.icon}
                </div>
                <div>
                  <h3 className="text-base font-bold text-white mb-1.5 font-display tracking-tight">
                    {hl.title}
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed font-sans">
                    {hl.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
