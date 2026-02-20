import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await setDoc(doc(db, "users", res.user.uid), {
          name: formData.name,
          email: formData.email,
          createdAt: new Date()
        });
      }
      window.location.href = "/";
    } catch (err) {
      setError(err.code === 'auth/user-not-found' ? "Utilisateur inconnu" : "Identifiants invalides");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 selection:bg-orange-100 selection:text-orange-600">
      {/* Background Decor */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-orange-50 rounded-full blur-[120px] opacity-60" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-slate-200 rounded-full blur-[120px] opacity-60" />
      </div>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full relative"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-[3rem] p-8 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20 relative z-10">
          
          <div className="text-center mb-10">
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-12 h-12 bg-black rounded-2xl mb-6 shadow-lg shadow-black/20"
            >
              <Sparkles className="text-orange-500" size={24} />
            </motion.div>
            
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              {isLogin ? 'Bon retour' : 'L\'Élite'}
              <span className="text-orange-500">.</span>
            </h2>
            <p className="text-slate-400 text-[10px] mt-3 uppercase tracking-[0.4em] font-bold">
              {isLogin ? 'G.S Intelligence System' : 'Nouveau Protocole'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative"
                >
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" placeholder="NOM COMPLET" required
                    className="w-full bg-slate-100/50 border-2 border-transparent px-12 py-4 rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-xs font-bold tracking-wider outline-none"
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div variants={itemVariants} className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="email" placeholder="EMAIL" required
                className="w-full bg-slate-100/50 border-2 border-transparent px-12 py-4 rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-xs font-bold tracking-wider outline-none"
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                placeholder="MOT DE PASSE" 
                required
                className="w-full bg-slate-100/50 border-2 border-transparent px-12 py-4 rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 transition-all text-xs font-bold tracking-wider outline-none"
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 p-1"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </motion.div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-red-500 text-[9px] font-black uppercase text-center tracking-[0.2em] bg-red-50 py-2 rounded-lg"
              >
                {error}
              </motion.p>
            )}

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 hover:bg-orange-600 transition-colors shadow-2xl shadow-orange-500/20 disabled:opacity-50"
            >
              {loading ? "Chargement..." : isLogin ? 'Se connecter' : "S'inscrire"} 
              {!loading && <ArrowRight size={16} className="mt-[-2px]" />}
            </motion.button>
          </form>

          <div className="text-center mt-10">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setShowPassword(false);
                setError("");
              }}
              className="group relative inline-flex flex-col items-center"
            >
              <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] group-hover:text-slate-900 transition-colors">
                {isLogin ? "Nouveau ici ? Créer un compte" : "Déjà membre ? Se connecter ici"}
              </span>
              <span className="h-[2px] w-0 bg-orange-500 mt-1 group-hover:w-full transition-all duration-500 ease-out" />
            </button>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-[9px] text-slate-400 font-medium mt-8 uppercase tracking-[0.2em]">
          &copy; 2026 G.S Elite Corp. Tous droits réservés.
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;