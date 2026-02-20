import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertCircle, ShieldCheck } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState("");

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
          name: formData.name || "Elite Member",
          email: formData.email,
          createdAt: new Date()
        });
      }
      window.location.href = "/"; 
    } catch (err) {
      const errorMap = {
        'auth/email-already-in-use': "Cet email est déjà enregistré au club.",
        'auth/weak-password': "Sécurité trop faible (6 caractères min).",
        'auth/user-not-found': "Compte inexistant.",
        'auth/wrong-password': "Mot de passe incorrect.",
        'auth/invalid-credential': "Accès refusé. Vérifiez vos infos.",
        'auth/invalid-email': "Format d'email invalide."
      };
      setError(errorMap[err.code] || "Une erreur système est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfcfd] px-4 selection:bg-orange-500 selection:text-white">
      {/* Fond décoratif minimaliste */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-64 h-64 bg-orange-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-slate-200/50 rounded-full blur-3xl" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full relative z-10"
      >
        <div className="bg-white rounded-[3rem] p-10 md:p-12 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] border border-slate-100">
          
          {/* Header */}
          <div className="text-center mb-10">
            <motion.div
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 mb-6"
            >
              <ShieldCheck size={12} className="text-orange-500" />
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400">Secure Access</span>
            </motion.div>
            
            <h2 className="text-4xl font-black uppercase tracking-tighter text-slate-900 leading-none">
              {isLogin ? 'Authentification' : 'Join the Club'}
              <span className="text-orange-500">.</span>
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <LayoutGroup>
              <AnimatePresence mode="popLayout">
                {!isLogin && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -10 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -10 }}
                    className="relative"
                  >
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" placeholder="NOM COMPLET" required
                      className="w-full bg-slate-50 border-2 border-transparent px-12 py-4 rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-[11px] font-bold tracking-widest uppercase"
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
              
              <motion.div layout className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="email" placeholder="EMAIL ADDRESS" required
                  className="w-full bg-slate-50 border-2 border-transparent px-12 py-4 rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-[11px] font-bold tracking-widest uppercase"
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </motion.div>

              <motion.div layout className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="PASSWORD" required
                  className="w-full bg-slate-50 border-2 border-transparent px-12 py-4 rounded-2xl focus:bg-white focus:border-orange-500/20 focus:ring-4 focus:ring-orange-500/5 transition-all outline-none text-[11px] font-bold tracking-widest uppercase pr-12"
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-600 p-1 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </motion.div>
            </LayoutGroup>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl flex items-center gap-3"
                >
                  <AlertCircle className="text-rose-500 shrink-0" size={16} />
                  <p className="text-rose-600 text-[10px] font-black uppercase tracking-wider leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button 
              layout
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
              className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-[0.3em] text-[11px] flex items-center justify-center gap-3 hover:bg-orange-600 transition-colors shadow-xl shadow-slate-200 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Connexion' : "S'inscrire"} <ArrowRight size={16} />
                </>
              )}
            </motion.button>
          </form>

          {/* Switch Mode Button */}
          <div className="mt-10 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
                setShowPassword(false);
              }}
              className="group flex flex-col items-center mx-auto"
            >
              <span className="text-slate-400 text-[9px] font-black uppercase tracking-[0.25em] group-hover:text-slate-900 transition-colors">
                {isLogin ? "Nouveau ici ? Créer un profil" : "Déjà membre ? Se connecter"}
              </span>
              <div className="h-[2px] w-6 bg-orange-500 mt-2 scale-x-50 group-hover:scale-x-150 transition-transform duration-500" />
            </button>
          </div>

        </div>
        
        {/* Footer */}
        <p className="text-center mt-8 text-slate-300 text-[9px] font-bold uppercase tracking-[0.4em]">
          G.S Authorized System &copy; 2026
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;