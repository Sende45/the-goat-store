import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff } from 'lucide-react';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
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
      setError("Erreur : Vérifiez vos identifiants");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {isLogin ? 'Bon retour chez G.S' : 'Rejoindre l\'Élite'}
          </h2>
          <p className="text-slate-400 text-[10px] mt-2 uppercase tracking-[0.3em] font-black">
            {isLogin ? 'Accédez à votre espace GOAT' : 'Nouveau Compte'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" placeholder="Nom complet" required
                className="w-full bg-slate-50 border-none px-12 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" placeholder="Email" required
              className="w-full bg-slate-50 border-none px-12 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type={showPassword ? "text" : "password"}
              placeholder="Mot de passe" 
              required
              className="w-full bg-slate-50 border-none px-12 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all text-sm font-medium"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500 transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center tracking-widest">{error}</p>}

          <button className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-all active:scale-95 shadow-lg shadow-slate-200">
            {isLogin ? 'Se connecter' : "S'inscrire"} <ArrowRight size={18} />
          </button>
        </form>

        {/* SECTION MODIFIÉE : Le lien avec le trait orange */}
        <div className="text-center mt-8">
          <button 
            onClick={() => {
              setIsLogin(!isLogin);
              setShowPassword(false);
            }}
            className="group inline-flex flex-col items-center"
          >
            <span className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-black transition-colors">
              {isLogin ? "Nouveau ici ? Créer un compte" : "Déjà membre ? Se connecter ici"}
            </span>
            {/* Le fameux trait orange sous le lien */}
            <div className="h-0.5 w-full bg-orange-500 mt-1 transform scale-x-50 group-hover:scale-x-100 transition-transform duration-300 origin-center" />
          </button>
        </div>

      </div>
    </div>
  );
};

export default Auth;