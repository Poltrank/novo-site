import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, MessageSquare, Plus, CheckCircle, AlertCircle, Sparkles, Send } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { collection, addDoc, getDocs, serverTimestamp, query, orderBy, limit } from 'firebase/firestore';
import { CustomerReview } from '../types';

export default function Reviews() {
  const [reviews, setReviews] = useState<CustomerReview[]>([]);
  const [loading, setLoading] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  // Status states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Form show state
  const [showForm, setShowForm] = useState(false);

  // Core predefined testimonals from user prompt
  const initialTestimonials = [
    {
      id: 'mock-1',
      name: 'Paula Mendes',
      companyName: 'Mendes Contabilidade',
      rating: 5,
      comment: 'Atendimento extremamente rápido. Problema resolvido em poucos minutos.',
      createdAt: new Date('2026-07-10T10:00:00Z'),
    },
    {
      id: 'mock-2',
      name: 'Guilherme Santos',
      companyName: 'TechVibe Logistics',
      rating: 5,
      comment: 'Excelente profissional. Sempre disponível quando precisamos.',
      createdAt: new Date('2026-07-08T10:00:00Z'),
    },
    {
      id: 'mock-3',
      name: 'Mariana Costa',
      companyName: 'Costa & Advogados Associados',
      rating: 5,
      comment: 'Melhor suporte técnico que nossa empresa já contratou.',
      createdAt: new Date('2026-07-05T10:00:00Z'),
    },
  ];

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const reviewsRef = collection(db, 'reviews');
      const q = query(reviewsRef, orderBy('createdAt', 'desc'), limit(12));
      const snapshot = await getDocs(q);
      const list: CustomerReview[] = [];
      snapshot.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() } as CustomerReview);
      });
      setReviews(list);
    } catch (err) {
      console.error("Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim().length < 5) {
      setErrorMessage('O comentário deve conter pelo menos 5 caracteres.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSubmitSuccess(false);

    const reviewData = {
      name: name.trim(),
      companyName: companyName.trim(),
      rating,
      comment: comment.trim(),
      createdAt: serverTimestamp(),
    };

    try {
      const reviewsRef = collection(db, 'reviews');
      const docRef = await addDoc(reviewsRef, reviewData);

      // Add to local list smoothly
      const newLocalReview: CustomerReview = {
        id: docRef.id,
        name: name.trim(),
        companyName: companyName.trim(),
        rating,
        comment: comment.trim(),
        createdAt: new Date(),
      };

      setReviews((prev) => [newLocalReview, ...prev]);
      setSubmitSuccess(true);
      
      // Reset form
      setName('');
      setCompanyName('');
      setRating(5);
      setComment('');

      setTimeout(() => {
        setSubmitSuccess(false);
        setShowForm(false);
      }, 3000);

    } catch (err) {
      try {
        handleFirestoreError(err, OperationType.CREATE, 'reviews');
      } catch (formattedErr: any) {
        setErrorMessage('Ocorreu um erro ao registrar sua avaliação. Verifique se está autenticado.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Combine mock testimonials with firestore-loaded ones
  const allReviews = [...reviews, ...initialTestimonials];

  return (
    <section id="reviews" className="py-24 relative overflow-hidden bg-slate-900">
      {/* Visual backdrops */}
      <div className="absolute top-1/2 left-0 w-80 h-80 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-4 max-w-2xl text-left">
            <span className="text-xs font-mono font-bold tracking-widest text-sky-400 uppercase block">
              Qualidade Aprovada
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-white tracking-tight">
              O Que Nossos Clientes Corporativos Dizem?
            </h2>
            <div className="w-16 h-1 bg-gradient-to-r from-sky-400 to-indigo-400 rounded-full" />
            <p className="text-slate-400 font-sans">
              Veja o feedback de quem já conta com o suporte remoto rápido e profissional da Nexus para manter as operações computacionais estáveis.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="px-5 py-3 rounded-xl bg-white/5 border border-white/10 hover:border-white/20 text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer h-fit shrink-0 hover:bg-slate-800"
            id="btn-toggle-review-form"
          >
            <Plus className="w-4 h-4 text-sky-400" /> Avaliar Nosso Serviço
          </button>
        </div>

        {/* REVIEW FORM COLLAPSIBLE PANEL */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-12 overflow-hidden"
            >
              <div className="max-w-xl mx-auto p-6 sm:p-8 glass-panel border border-white/10 rounded-2xl relative text-left">
                {isSubmitting && (
                  <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs z-30 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-sky-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                )}

                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <Sparkles className="w-4.5 h-4.5 text-yellow-400" /> Enviar Minha Avaliação
                  </h3>
                  <button 
                    onClick={() => setShowForm(false)}
                    className="text-gray-400 hover:text-white text-xs"
                  >
                    Fechar
                  </button>
                </div>

                {/* Submit alerts */}
                {errorMessage && (
                  <div className="mb-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-3">
                    <AlertCircle className="w-4.5 h-4.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}
                {submitSuccess && (
                  <div className="mb-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-xs flex items-center gap-3">
                    <CheckCircle className="w-4.5 h-4.5" />
                    <span>Avaliação enviada com sucesso! Obrigado pelo feedback.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Seu Nome</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Carlos Oliveira"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        id="review-name"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Sua Empresa</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Alfa Transportes"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                        id="review-company"
                      />
                    </div>
                  </div>

                  {/* Rating selection */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider block">Nota (1 a 5 estrelas)</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 hover:scale-110 transition-transform cursor-pointer"
                        >
                          <Star 
                            className={`w-6 h-6 ${
                              star <= rating 
                                ? 'fill-yellow-400 stroke-yellow-400' 
                                : 'stroke-gray-500'
                            }`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Comments */}
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-300 font-semibold uppercase tracking-wider">Comentário</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Deixe seu feedback detalhado sobre a velocidade, qualidade ou presteza..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs"
                      id="review-comment"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-sky-500/10"
                    id="review-btn-submit"
                  >
                    <Send className="w-3.5 h-3.5" /> Enviar Avaliação
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TESTIMONIALS GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allReviews.map((rev, idx) => (
            <motion.div
              key={rev.id}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="p-6 rounded-2xl bg-slate-950/40 border border-white/5 hover:border-sky-500/20 hover:bg-slate-950/60 transition-all duration-300 flex flex-col justify-between text-left"
            >
              <div className="space-y-4">
                {/* Header info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-500 flex items-center justify-center text-white font-bold text-sm">
                    {rev.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white font-display">{rev.name}</h4>
                    <p className="text-xs text-slate-400">{rev.companyName}</p>
                  </div>
                </div>

                {/* Stars */}
                <div className="flex gap-1.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${
                        i < rev.rating 
                          ? 'fill-yellow-400 stroke-yellow-400' 
                          : 'stroke-gray-700'
                      }`} 
                    />
                  ))}
                </div>

                {/* Comment body */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans italic">
                  "{rev.comment}"
                </p>
              </div>

              {/* Verified badge or date */}
              <div className="pt-4 border-t border-white/5 mt-4 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle className="w-3.5 h-3.5" /> Cliente Verificado
                </span>
                <span>
                  {rev.createdAt?.toDate ? rev.createdAt.toDate().toLocaleDateString('pt-BR') : new Date(rev.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
