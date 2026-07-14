import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckSquare, Smile, Globe, Clock } from 'lucide-react';

export default function Stats() {
  // Simple increment animation triggered on load
  const [resolvedCount, setResolvedCount] = useState(0);
  const [satisfactionCount, setSatisfactionCount] = useState(0);
  const [onlinePercent, setOnlinePercent] = useState(0);
  const [responseTime, setResponseTime] = useState(60); // Counts down to 15

  useEffect(() => {
    // Animate resolved calls to 500+
    const resolvedTimer = setInterval(() => {
      setResolvedCount((prev) => {
        if (prev >= 500) {
          clearInterval(resolvedTimer);
          return 537;
        }
        return prev + 17;
      });
    }, 30);

    // Animate satisfaction to 98%
    const satTimer = setInterval(() => {
      setSatisfactionCount((prev) => {
        if (prev >= 98) {
          clearInterval(satTimer);
          return 98;
        }
        return prev + 2;
      });
    }, 40);

    // Animate online to 100%
    const onlineTimer = setInterval(() => {
      setOnlinePercent((prev) => {
        if (prev >= 100) {
          clearInterval(onlineTimer);
          return 100;
        }
        return prev + 4;
      });
    }, 50);

    // Animate response time to 15
    const respTimer = setInterval(() => {
      setResponseTime((prev) => {
        if (prev <= 15) {
          clearInterval(respTimer);
          return 12;
        }
        return prev - 2;
      });
    }, 50);

    return () => {
      clearInterval(resolvedTimer);
      clearInterval(satTimer);
      clearInterval(onlineTimer);
      clearInterval(respTimer);
    };
  }, []);

  const statItems = [
    {
      icon: <CheckSquare className="w-8 h-8 text-sky-400" />,
      number: `+${resolvedCount}`,
      label: 'Chamados Resolvidos',
      sublabel: 'Com total rapidez e precisão',
    },
    {
      icon: <Smile className="w-8 h-8 text-indigo-400" />,
      number: `${satisfactionCount}%`,
      label: 'Satisfação dos Clientes',
      sublabel: 'Avaliação excelente contínua',
    },
    {
      icon: <Globe className="w-8 h-8 text-sky-300" />,
      number: `${onlinePercent}%`,
      label: 'Atendimento Online',
      sublabel: 'Segurança remota em tempo real',
    },
    {
      icon: <Clock className="w-8 h-8 text-indigo-300" />,
      number: `< ${responseTime}min`,
      label: 'Tempo Médio de Resposta',
      sublabel: 'Acionamento e início imediato',
    },
  ];

  return (
    <section className="py-20 relative bg-slate-900 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="p-6 rounded-2xl glass-panel text-center space-y-4 group hover:border-sky-500/20 transition-colors"
            >
              <div className="mx-auto w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-300 shadow-inner">
                {item.icon}
              </div>
              <div className="space-y-1">
                <span className="text-3xl font-bold font-display text-white tracking-tight">
                  {item.number}
                </span>
                <h3 className="text-xs font-bold text-slate-400 uppercase font-sans tracking-widest">
                  {item.label}
                </h3>
                <p className="text-xs text-slate-500 font-sans">
                  {item.sublabel}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
