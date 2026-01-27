import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { db, auth } from '../firebase'; // On ajoute auth ici
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Commander = () => {
  const { cart, cartTotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // On récupère l'utilisateur actuellement connecté
    const user = auth.currentUser;

    // MODIFICATION : On s'assure que les items incluent la taille choisie pour la BD
    const itemsWithSizes = cart.map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      size: item.size || null, // Capture la taille sélectionnée
      image: item.image || ""
    }));

    const orderData = {
      // Informations du formulaire
      customerName: e.target[0].value,
      whatsapp: e.target[1].value,
      address: e.target[2].value,
      
      // Informations du panier (avec les tailles incluses)
      items: itemsWithSizes,
      total: cartTotal,
      
      // Liaison avec le compte client
      userId: user ? user.uid : "guest", // Si pas connecté, on marque "guest"
      userEmail: user ? user.email : "non-connecté",
      
      // MODIFICATION : Statut synchronisé avec le système de tracking ("pending")
      status: "pending",
      statusLabel: "En attente",
      createdAt: serverTimestamp()
    };

    try {
      await addDoc(collection(db, "orders"), orderData);
      setSubmitted(true);
      clearCart();
    } catch (err) {
      console.error("Erreur Firebase:", err);
      alert("Problème de connexion. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="text-center">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={40} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-black uppercase italic tracking-tighter">Commande validée !</h2>
        <p className="text-slate-500 font-bold text-xs tracking-widest mt-3 uppercase">
          L'équipe GOATSTORE vous contactera sur WhatsApp.
        </p>
        <div className="mt-10 space-y-4">
          <Link to="/profile" className="block w-full bg-black text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest">
            Voir mon suivi de commande
          </Link>
          <Link to="/" className="block text-slate-400 font-bold text-[10px] uppercase tracking-widest">
            Retour à la boutique
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="pt-32 pb-20 px-6 max-w-xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-black mb-2 uppercase italic tracking-tighter">Finaliser la commande</h1>
        <div className="h-1 w-12 bg-orange-600 mx-auto rounded-full"></div>
      </div>

      <div className="bg-slate-50 p-6 rounded-[2rem] mb-8 flex justify-between items-center">
        <span className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">Total à payer</span>
        <span className="text-2xl font-black text-orange-600">{cartTotal.toLocaleString()} FCFA</span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-slate-400">Destinataire</label>
          <input type="text" placeholder="Nom complet" className="w-full p-5 bg-white border border-slate-100 shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all" required />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-slate-400">Contact</label>
          <input type="tel" placeholder="Numéro WhatsApp (ex: 07...)" className="w-full p-5 bg-white border border-slate-100 shadow-sm rounded-2xl outline-none focus:ring-2 focus:ring-orange-500 transition-all" required />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest ml-4 text-slate-400">Livraison</label>
          <textarea placeholder="Commune, quartier et précisions (ex: Cocody, Cité des arts...)" className="w-full p-5 bg-white border border-slate-100 shadow-sm rounded-2xl outline-none h-32 focus:ring-2 focus:ring-orange-500 transition-all resize-none" required></textarea>
        </div>

        <button 
          disabled={loading || cart.length === 0} 
          className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest transition-all flex items-center justify-center gap-3 mt-6 ${
            loading ? 'bg-slate-200 text-slate-400' : 'bg-black text-white hover:bg-orange-600 shadow-xl active:scale-95'
          }`}
        >
          {loading ? "Traitement..." : <>Confirmer l'achat <ArrowRight size={18} /></>}
        </button>
      </form>
      
      {cart.length === 0 && (
        <p className="text-center text-red-500 text-[10px] font-bold uppercase mt-4">Votre panier est vide</p>
      )}
    </div>
  );
};

export default Commander;