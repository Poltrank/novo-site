import React from 'react';
import { Shield, ArrowUp, Linkedin, Twitter, Github, Globe } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLinkClick = (e: React.MouseEvent, view: string) => {
    e.preventDefault();
    onNavigate(view);
  };

  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-16 pb-8 relative overflow-hidden">
      <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Main Grid footer layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 mb-12">
          
          {/* Col 1: Brand details */}
          <div className="md:col-span-5 space-y-4 text-left">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-sky-500 rounded-lg flex items-center justify-center not-italic shadow-lg shadow-sky-500/25">
                <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
              </div>
              <span className="font-display font-bold text-lg text-white tracking-tight italic">
                NEXUS<span className="text-sky-400">SUPORTE</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-sm">
              Soluções modernas em suporte de informática e consultoria em TI para pequenas, médias e grandes empresas. Conectividade remota segura, SLA de atendimento rápido e total estabilidade técnica.
            </p>
            {/* Social Icons */}
            <div className="flex gap-4">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/20 hover:text-sky-400 text-gray-400 transition-colors">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/20 hover:text-sky-400 text-gray-400 transition-colors">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/20 hover:text-sky-400 text-gray-400 transition-colors">
                <Github className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-sky-500/20 hover:text-sky-400 text-gray-400 transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono">Links Rápidos</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#home" onClick={(e) => handleLinkClick(e, 'home')} className="text-slate-400 hover:text-sky-400 transition-colors">Página Inicial</a>
              </li>
              <li>
                <a href="#services" onClick={(e) => handleLinkClick(e, 'services')} className="text-slate-400 hover:text-sky-400 transition-colors">Serviços de TI</a>
              </li>
              <li>
                <a href="#why-us" onClick={(e) => handleLinkClick(e, 'why-us')} className="text-slate-400 hover:text-sky-400 transition-colors">Nossos Diferenciais</a>
              </li>
              <li>
                <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="text-slate-400 hover:text-sky-400 transition-colors">Sobre Nós</a>
              </li>
              <li>
                <a href="#reviews" onClick={(e) => handleLinkClick(e, 'reviews')} className="text-slate-400 hover:text-sky-400 transition-colors">Avaliações</a>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal stuff */}
          <div className="md:col-span-4 space-y-4 text-left">
            <h4 className="text-xs font-bold text-white uppercase tracking-widest font-mono font-sans">Documentação Legal</h4>
            <ul className="space-y-2 text-xs text-slate-400 leading-relaxed">
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Política de Privacidade B2B</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Termos de Uso e Acordo de SLA</a>
              </li>
              <li>
                <a href="#" className="hover:text-sky-400 transition-colors">Acordo de Confidencialidade (NDA)</a>
              </li>
              <li className="text-[11px] text-slate-500">
                Nexus Tecnologia e Suporte de Informática LTDA.<br />
                Todos os direitos reservados para 2026.
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar footer details */}
        <div className="border-t border-white/5 pt-8 mt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[11px] text-gray-500 font-sans text-center sm:text-left">
            © 2026 Nexus Suporte Técnico Corporativo. Desenvolvido com padrões de excelência tecnológica e Glassmorphism UI.
          </p>

          <button
            onClick={handleScrollToTop}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            id="btn-scroll-top"
          >
            Voltar ao Topo <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
