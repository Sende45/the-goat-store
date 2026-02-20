import React, { useState } from 'react';
import { MessageSquare, Send, Zap, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactWhatsApp = () => {
  const [msg, setMsg] = useState({ name: '', subject: 'Question sur un produit', body: '' });

  const sendWhatsApp = (e) => {
    e.preventDefault();
    const phone = "2250767793120";
    const text = `Bonjour GOATSTORE ! 👋%0A%0A*Nom:* ${msg.name}%0A*Sujet:* ${msg.subject}%0A*Message:* ${msg.body}`;
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden">
      {/* Éléments de décor en arrière-plan */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-green-100 rounded-full blur-[120px] opacity-50 -z-10" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-100 rounded-full blur-[100px] opacity-50 -z-10" />

      <div className="max-w-4xl mx-auto px-6">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          
          {/* Côté Texte / Réassurance */}
          <div className="lg:col-span-2 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              <Zap size={14} fill="currentColor" /> Réponse Rapide
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl font-[1000] text-slate-900 leading-[1.1] tracking-tighter">
              Une question ? <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-emerald-600">
                On vous répond.
              </span>
            </h2>
            
            <p className="text-slate-500 text-lg leading-relaxed">
              Besoin d'un conseil sur une taille ou un suivi ? Notre équipe est disponible en direct pour vous accompagner.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-slate-700 font-semibold">
                <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-green-500 border border-slate-100">
                  <ShieldCheck size={18} />
                </div>
                Support sécurisé 24/7
              </div>
            </div>
          </div>

          {/* Formulaire Carte */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <div className="relative group">
              {/* Effet de bordure néon au sursaut */}
              <div className="absolute -inset-1 bg-gradient-to-r from-green-400 to-emerald-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              
              <div className="relative bg-white p-8 md:p-10 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100">
                <div className="flex items-center justify-between mb-10">
                  <div className="flex items-center gap-4">
                    <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-3.5 rounded-2xl text-white shadow-lg shadow-green-200">
                      <MessageSquare size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-900 leading-none">WhatsApp Direct</h3>
                      <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">G.S Elite Support</p>
                    </div>
                  </div>
                  <div className="hidden sm:flex flex-col items-end">
                    <span className="flex items-center gap-1.5 text-xs font-bold text-green-500 uppercase tracking-wider">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> En ligne
                    </span>
                  </div>
                </div>

                <form onSubmit={sendWhatsApp} className="space-y-5">
                  <div className="group relative">
                    <input 
                      type="text" placeholder="Votre nom complet" required
                      className="w-full bg-slate-50 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white focus:border-green-400 transition-all outline-none font-medium"
                      onChange={(e) => setMsg({...msg, name: e.target.value})}
                    />
                  </div>

                  <div className="relative">
                    <select 
                      className="w-full bg-slate-50 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white focus:border-green-400 transition-all outline-none font-medium appearance-none text-slate-600"
                      onChange={(e) => setMsg({...msg, subject: e.target.value})}
                    >
                      <option>Question sur un produit</option>
                      <option>Suivi de commande</option>
                      <option>Partenariat / Influence</option>
                    </select>
                    <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                      <Zap size={16} />
                    </div>
                  </div>

                  <textarea 
                    placeholder="Comment pouvons-nous vous aider ?" required rows="4"
                    className="w-full bg-slate-50 border-2 border-transparent px-6 py-4 rounded-2xl focus:bg-white focus:border-green-400 transition-all outline-none font-medium resize-none"
                    onChange={(e) => setMsg({...msg, body: e.target.value})}
                  ></textarea>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[13px] flex items-center justify-center gap-4 hover:bg-green-500 transition-all duration-500 shadow-xl shadow-slate-100"
                  >
                    Lancer la discussion <Send size={18} />
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactWhatsApp;