import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Mail, Lock, User, ArrowRight, Eye, EyeOff, AlertTriangle } from 'lucide-react'; // Ajout des icônes

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false); // AJOUT: État pour afficher/masquer le mot de passe
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isLogin) {
        // CONNEXION
        await signInWithEmailAndPassword(auth, formData.email, formData.password);
      } else {
        // INSCRIPTION (Nouveau Client)
        const res = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        
        // Sauvegarde du profil dans la base de données
        await setDoc(doc(db, "users", res.user.uid), {
          name: formData.name || "Client G.S",
          email: formData.email,
          createdAt: new Date()
        });
      }
      // Si tout est bon, on redirige vers l'accueil
      window.location.href = "/"; 
    } catch (err) {
      console.error("Code erreur Firebase:", err.code);

      // GESTION DES ERREURS DYNAMIQUE
      if (err.code === 'auth/email-already-in-use') {
        setError("Cet email appartient déjà à un membre du club G.S.");
      } else if (err.code === 'auth/weak-password') {
        setError("Sécurité insuffisante : 6 caractères minimum.");
      } else if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Identifiants incorrects. Vérifiez vos accès.");
      } else if (err.code === 'auth/invalid-email') {
        setError("Le format de l'adresse email est incorrect.");
      } else {
        setError("Une erreur est survenue. Veuillez réessayer.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 pt-20">
      <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-xl border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black uppercase tracking-tighter">
            {isLogin ? 'Connexion G.S' : 'Rejoindre l\'Élite'}
          </h2>
          <p className="text-[10px] font-bold text-orange-600 tracking-[0.3em] uppercase mt-2">
            {isLogin ? 'Accès Membre' : 'Nouveau Compte'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" placeholder="Nom complet" required
                className="w-full bg-slate-50 border-none px-12 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          )}
          
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="email" placeholder="Email" required
              className="w-full bg-slate-50 border-none px-12 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none"
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            {/* MODIF: Type dynamique pour afficher/masquer le password */}
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Mot de passe" required
              className="w-full bg-slate-50 border-none px-12 py-4 rounded-2xl focus:ring-2 focus:ring-orange-500 transition-all outline-none pr-12"
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            {/* AJOUT: Bouton pour basculer la visibilité */}
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-orange-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-100 p-3 rounded-xl flex items-center gap-3">
              <AlertTriangle className="text-red-500 flex-shrink-0" size={20} />
              <p className="text-red-600 text-[11px] font-bold uppercase tracking-tight">{error}</p>
            </div>
          )}

          <button className="w-full bg-black text-white py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg active:scale-95">
            {isLogin ? 'Se connecter' : "S'inscrire"} <ArrowRight size={18} />
          </button>
        </form>

        <button 
          onClick={() => {
            setIsLogin(!isLogin);
            setError("");
            setShowPassword(false); // AJOUT: On masque le mdp quand on change de mode
          }}
          className="w-full mt-8 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] hover:text-orange-600 transition-colors"
        >
          {isLogin ? "Nouveau chez GOATSTORE ? Créer un compte" : "Déjà membre ? Se connecter ici"}
        </button>
      </div>
    </div>
  );
};

export default Auth;