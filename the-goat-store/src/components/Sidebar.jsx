import React from 'react';
import { Shirt, Smartphone, Footprints, ChevronRight, X, LayoutGrid, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ isOpen, onClose, onCategorySelect, onReset }) => {
  const categories = [
    {
      name: "Digital",
      icon: <Smartphone className="w-5 h-5" />,
      color: "text-blue-500",
      sub: ["Téléphones", "Ordinateurs", "Consoles", "Accessoires"]
    },
    {
      name: "Vêtements",
      icon: <Shirt className="w-5 h-5" />,
      color: "text-orange-500",
      sub: ["Homme", "Femme", "Enfant"]
    },
    {
      name: "Chaussures",
      icon: <Footprints className="w-5 h-5" />,
      color: "text-emerald-500",
      sub: ["Baskets", "Luxe", "Sport"]
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* 1. OVERLAY - Effet flou Premium */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-[1100]"
            onClick={onClose}
          />

          {/* 2. SIDEBAR */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-y-0 left-0 z-[1200] w-[85%] sm:w-[380px] bg-white shadow-2xl flex flex-col"
          >
            
            {/* HEADER SIDEBAR */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-[1000] text-slate-900 tracking-tighter uppercase leading-none">
                  G.S <span className="text-orange-600">Catalogue</span>
                </h2>
                <div className="flex items-center gap-1 mt-1">
                  <Star size={10} fill="currentColor" className="text-orange-500" />
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Premium Selection</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full text-slate-900 active:scale-90 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* NAVIGATION CONTENT */}
            <div className="flex-grow overflow-y-auto p-5 custom-scrollbar">
              
              {/* BOUTON "VOIR TOUT" - Look Néon/Dark */}
              <motion.button 
                whileTap={{ scale: 0.97 }}
                onClick={() => { onReset(); onClose(); }}
                className="flex items-center justify-between w-full p-5 mb-8 bg-slate-900 rounded-2xl shadow-xl shadow-slate-200 group overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex items-center gap-4">
                  <div className="bg-white/10 p-2 rounded-lg">
                    <LayoutGrid size={18} className="text-white group-hover:rotate-90 transition-transform duration-500" /> 
                  </div>
                  <span className="font-black text-[11px] uppercase tracking-[0.2em] text-white">Tout l'univers G.S</span>
                </div>
                <Zap size={14} className="text-orange-500 group-hover:text-white relative z-10" />
              </motion.button>

              <div className="space-y-8">
                {categories.map((cat, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + (idx * 0.1) }}
                    key={cat.name} 
                    className="space-y-4"
                  >
                    {/* Catégorie parente */}
                    <button 
                      onClick={() => { onCategorySelect(cat.name); onClose(); }}
                      className="flex items-center gap-4 w-full group"
                    >
                      <div className={`p-3 rounded-2xl bg-slate-50 group-hover:bg-white group-hover:shadow-md transition-all duration-300 ${cat.color}`}>
                        {cat.icon}
                      </div>
                      <span className="flex-1 text-left font-[1000] uppercase text-xs tracking-widest text-slate-900 group-hover:text-orange-600 transition-colors">
                        {cat.name}
                      </span>
                      <ChevronRight size={14} className="text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </button>
                    
                    {/* Sous-catégories - Design épuré */}
                    <div className="grid grid-cols-1 gap-2 ml-4 border-l-2 border-slate-50 pl-6">
                      {cat.sub.map(s => (
                        <button 
                          key={s}
                          onClick={() => { onCategorySelect(s); onClose(); }}
                          className="flex items-center justify-between w-full py-2 text-[13px] font-bold text-slate-500 hover:text-slate-900 transition-colors group/sub"
                        >
                          <span>{s}</span>
                          <div className="h-px w-0 group-hover/sub:w-8 bg-orange-200 transition-all duration-300" />
                        </button>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* FOOTER SIDEBAR */}
            <div className="p-8 mt-auto">
              <div className="bg-slate-50 rounded-2xl p-4 flex items-center gap-4">
                 <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   Service client Abidjan actif
                 </p>
              </div>
              <p className="mt-6 text-[8px] text-slate-300 font-black uppercase tracking-[0.4em] text-center">
                Edition Limitée — Goatstore
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default Sidebar;