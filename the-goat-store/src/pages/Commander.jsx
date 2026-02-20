import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase'; 
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle, ArrowRight, AlertCircle, MapPin, Phone, User, ShieldCheck, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Commander = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) return;
    
    setLoading(true);
    setError(null);

    const user = auth.currentUser;
    // Utilisation directe des éléments pour éviter les bugs FormData sur certains navigateurs
    const name = e.target.name.value;
    const phone = e.target.phone.value;
    const address = e.target.address.value;

    const orderData = {
      customerName: name,
      whatsapp: phone,
      address: address,
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        size: item.size || "Standard",
        image: item.image || ""
      })),
      total: cartTotal,
      userId: user ? user.uid : "guest",
      userEmail: user ? user.email : "guest_checkout",
      status: "pending",
      statusLabel: "En attente",
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error(err);
      setError("Erreur de connexion. Vérifiez votre réseau.");
    } finally {
      setLoading(false);
    }
  };

  // --- ECRAN DE SUCCÈS (S'affiche après la commande) ---
  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} 
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-white" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900">Commande Reçue.</h2>
          <p className="text-slate-500 font-medium text-sm mt-4">
            Un agent G.S vous contactera sur WhatsApp pour confirmer l'heure de livraison.
          </p>
          <div className="mt-10 space-y-4">
            <Link to="/profile" className="block w-full bg-slate-900 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg">
              Suivre mon colis
            </Link>
            <Link to="/" className="block text-slate-400 font-black uppercase text-[9px] tracking-[0.2em]">
              Retour Boutique
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-32 pb-20 px-6">
      <div className="max-w-2xl mx-auto">
        
        {/* HEADER */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 mb-4">
            <ShieldCheck size={12} className="text-orange-600" />
            <span className="text-orange-600 font-black text-[9px] uppercase tracking-widest">Paiement Cash à la livraison</span>
          </div>
          <h1 className="text-4xl font-black uppercase tracking-tighter text-slate-900">Check-out<span className="text-orange-600">.</span></h1>
        </div>

        {/* RÉCAPITULATIF ARGENT */}
        <div className="bg-white border border-slate-200 p-6 rounded-[2rem] mb-8 shadow-sm flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest">Total à régler</span>
            <span className="text-2xl font-black text-slate-900">{cartTotal.toLocaleString()} FCFA</span>
          </div>
          <div className="text-right">
            <span className="text-slate-400 font-black text-[9px] uppercase tracking-widest">Panier</span>
            <span className="block font-bold text-slate-900">{cart.length} Articles</span>
          </div>
        </div>

        {/* FORMULAIRE DE COMMANDE */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Nom */}
            <div className="relative">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="name" type="text" placeholder="NOM COMPLET" required 
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-[11px] uppercase tracking-wider" 
              />
            </div>

            {/* Téléphone */}
            <div className="relative">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                name="phone" type="tel" placeholder="NUMÉRO WHATSAPP" required 
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all font-bold text-[11px] uppercase tracking-wider" 
              />
            </div>

            {/* Adresse */}
            <div className="relative">
              <MapPin className="absolute left-5 top-5 text-slate-400" size={18} />
              <textarea 
                name="address" placeholder="ADRESSE DE LIVRAISON (Commune, Quartier, Repère...)" required 
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl outline-none h-32 focus:ring-2 focus:ring-orange-500 transition-all font-bold text-[11px] uppercase tracking-wider resize-none leading-relaxed" 
              />
            </div>
          </div>

          {/* ERREUR */}
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 border border-red-100">
              <AlertCircle size={18} />
              <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
            </div>
          )}

          {/* BOUTON VALIDER */}
          <button 
            disabled={loading || cart.length === 0}
            className={`w-full py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] transition-all flex items-center justify-center gap-3 shadow-xl ${
              loading ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-orange-600 active:scale-95'
            }`}
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : <>Confirmer l'achat <ArrowRight size={18} /></>}
          </button>

          {cart.length === 0 && (
            <p className="text-center text-red-500 text-[9px] font-black uppercase tracking-widest mt-4 animate-pulse">Votre panier est vide</p>
          )}
        </form>
      </div>
    </div>
  );
};

export default Commander;