import { motion } from 'motion/react';
import { 
  Monitor, Cpu, HardDrive, CloudUpload, Wifi, DownloadCloud, 
  Printer, Terminal, FileSpreadsheet, ShieldAlert, ShieldX, Briefcase 
} from 'lucide-react';

export default function Services() {
  const serviceList = [
    {
      icon: <Monitor className="w-6 h-6" />,
      title: 'Suporte Remoto',
      description: 'Atendimento via AnyDesk ou TeamViewer para solução ágil de problemas operacionais cotidianos.',
    },
    {
      icon: <Cpu className="w-6 h-6" />,
      title: 'Manutenção de Computadores',
      description: 'Análise de performance, otimização de hardware, limpeza de registro e resolução de travamentos.',
    },
    {
      icon: <HardDrive className="w-6 h-6" />,
      title: 'Formatação e Instalação',
      description: 'Reinstalação limpa de sistemas operacionais sem perda de arquivos ou dados importantes.',
    },
    {
      icon: <CloudUpload className="w-6 h-6" />,
      title: 'Backup Corporativo',
      description: 'Configuração de rotinas automáticas de backup em nuvem (OneDrive, Google Drive, AWS) para proteção de dados.',
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: 'Configuração de Redes',
      description: 'Ajustes de roteadores, switches, redes Wi-Fi, compartilhamento de pastas e gerenciamento de IPs.',
    },
    {
      icon: <DownloadCloud className="w-6 h-6" />,
      title: 'Instalação de Programas',
      description: 'Instalação e ativação de softwares, ferramentas de engenharia, design, editores e aplicativos corporativos.',
    },
    {
      icon: <Printer className="w-6 h-6" />,
      title: 'Impressoras e Periféricos',
      description: 'Configuração de impressoras térmicas, multifuncionais, scanners em rede local e drivers atualizados.',
    },
    {
      icon: <Terminal className="w-6 h-6" />,
      title: 'Windows e Sistemas',
      description: 'Correção de erros de atualização, tela azul, falhas de DLL e licenciamento do sistema operacional.',
    },
    {
      icon: <FileSpreadsheet className="w-6 h-6" />,
      title: 'Microsoft Office e Email',
      description: 'Instalação do pacote Office, ativação, configuração de Outlook corporativo, SMTP, IMAP e Exchange.',
    },
    {
      icon: <ShieldAlert className="w-6 h-6" />,
      title: 'Segurança Cibernética',
      description: 'Firewall ativo, restrição de acessos indesejados e proteção de credenciais contra ameaças digitais.',
    },
    {
      icon: <ShieldX className="w-6 h-6" />,
      title: 'Remoção de Vírus',
      description: 'Varredura e erradicação completa de Malwares, Spywares, Adwares, Ransomwares e proteção preventiva.',
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      title: 'Consultoria em TI',
      description: 'Auditoria de infraestrutura de informática com foco em otimização de custos e aquisições eficientes.',
    },
  ];

  return (
    <section id="services" className="py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute top-1/4 right-1/10 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase">
            Nosso Portfólio de Atendimento
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
            Serviços Especializados de TI
          </h2>
          <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-indigo-400 mx-auto rounded-full" />
          <p className="text-slate-400 font-sans">
            Soluções completas e ágeis em informática para garantir estabilidade, segurança e eficiência operacional em sua empresa.
          </p>
        </div>

        {/* Bento/Grid style for services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serviceList.map((service, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.04 }}
              className="p-5 rounded-2xl bg-white/5 border border-white/5 hover:border-sky-500/20 hover:bg-slate-900/60 transition-all duration-300 group flex gap-4"
            >
              <div className="p-2.5 rounded-xl bg-sky-500/10 text-sky-400 h-fit group-hover:scale-110 group-hover:bg-sky-500 group-hover:text-white transition-all duration-300 shrink-0">
                {service.icon}
              </div>
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-white font-display tracking-tight group-hover:text-sky-300 transition-colors">
                  {service.title}
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  {service.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
