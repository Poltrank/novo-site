import { motion } from 'motion/react';
import { Play, ClipboardList, HelpCircle, Activity, Zap, CheckCircle } from 'lucide-react';
import bannerImage from '../assets/images/hero_support_banner_1784049103952.jpg';

interface HeroProps {
  onNavigate: (view: string) => void;
}

export default function Hero({ onNavigate }: HeroProps) {
  return (
    <section id="home" className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden min-h-screen flex items-center bg-slate-950">
      {/* Decorative background glows */}
      <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-sky-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      
      {/* Decorative Geometric Outline SVG */}
      <svg className="absolute top-24 right-1/4 w-32 h-32 text-slate-800/30 pointer-events-none hidden md:block" fill="none" viewBox="0 0 100 100">
        <rect x="10" y="10" width="80" height="80" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" strokeWidth="1" />
        <circle cx="50" cy="50" r="10" stroke="currentColor" strokeWidth="1" />
      </svg>
      
      {/* Dynamic Grid Background Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Copy & CTA */}
          <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-bold uppercase tracking-widest"
            >
              <Zap className="w-3.5 h-3.5 animate-pulse text-sky-400" />
              SLA inferior a 15 Minutos para Clientes Cadastrados
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-tight"
            >
              Suporte Técnico <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-indigo-400">
                Especializado para Empresas
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-slate-300 text-lg md:text-xl font-sans font-normal leading-relaxed max-w-2xl mx-auto lg:mx-0"
            >
              Atendimento remoto rápido, seguro e profissional para manter sua empresa funcionando sem interrupções. Atendimento 100% corporativo com técnicos certificados.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <button
                onClick={() => onNavigate('ticket-form')}
                className="px-8 py-4 bg-sky-500 hover:bg-sky-400 text-white rounded-xl text-base font-semibold shadow-xl shadow-sky-500/20 hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2.5 group font-sans"
                id="hero-btn-open-ticket"
              >
                <ClipboardList className="w-5 h-5 group-hover:rotate-6 transition-transform" />
                Abrir Chamado
              </button>
              
              <button
                onClick={() => onNavigate('contact')}
                className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-white rounded-xl text-base font-semibold hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 font-sans"
                id="hero-btn-request-contact"
              >
                Solicitar Atendimento
              </button>
            </motion.div>

            {/* Quick trust bullet points */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 max-w-lg mx-auto lg:mx-0 text-left"
            >
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-slate-400 font-medium font-sans">Suporte 100% Online</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-slate-400 font-medium font-sans">Técnicos Especialistas</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span className="text-xs text-slate-400 font-medium font-sans">Foco em Redução de Downtime</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Tech Illustration with generated image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            {/* Holographic borders/frames */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-900 shadow-2xl shadow-sky-500/5 group">
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent z-10 pointer-events-none" />
              
              <img
                src={bannerImage}
                alt="Nexus Suporte Técnico Corporativo"
                className="w-full h-auto object-cover opacity-90 group-hover:scale-[1.02] transition-transform duration-700"
                referrerPolicy="no-referrer"
              />

              {/* Glowing overlay stats badge */}
              <div className="absolute bottom-4 left-4 right-4 z-20 glass-panel border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                    <Activity className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block font-sans">Sistemas Monitorados</span>
                    <span className="text-sm font-bold text-white font-display">Tudo operando normalmente</span>
                  </div>
                </div>
                <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  ONLINE
                </span>
              </div>
            </div>

            {/* Ambient circle glow */}
            <div className="absolute -inset-1.5 bg-gradient-to-r from-sky-500 to-indigo-500 rounded-3xl blur opacity-15 pointer-events-none -z-10 animate-pulse" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
