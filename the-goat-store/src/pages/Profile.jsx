import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Package, Ticket, LogOut, ChevronRight } from 'lucide-react';

const Profile = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = auth.currentUser;

  useEffect(() => {
    const fetchOrders = async () => {
      if (user) {
        try {
          const q = query(collection(db, "orders"), where("userId", "==", user.uid));
          const querySnapshot = await getDocs(q);
          const ordersData = querySnapshot.docs.map(doc => ({ 
            id: doc.id, 
            ...doc.data() 
          }));
          setOrders(ordersData);
        } catch (error) {
          console.error("Erreur commandes:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchOrders();
  }, [user]);

  const handleLogout = async () => {
    await auth.signOut();
    window.location.href = "/";
  };

  if (!user) {
    return (
      <div className="pt-40 text-center">
        <p className="font-black uppercase tracking-widest text-slate-400">Accès refusé</p>
        <button onClick={() => window.location.href="/login"} className="mt-4 text-orange-600 font-bold underline">Se connecter</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* CARTE UTILISATEUR */}
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 bg-black rounded-[2rem] flex items-center justify-center text-white text-3xl font-black italic">
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-tighter italic">
                Membre <span className="text-orange-600">G.S</span>
              </h1>
              <p className="text-slate-400 font-bold text-sm">{user.email}</p>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="group flex items-center gap-2 text-slate-400 hover:text-red-500 font-black uppercase text-[10px] tracking-[0.2em] transition-all"
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* HISTORIQUE COMMANDES */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Package className="text-orange-600" size={20} />
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-900">Suivi des commandes</h3>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 min-h-[200px]">
              {loading ? (
                <p className="text-center py-10 text-slate-300 animate-pulse text-xs font-bold uppercase">Chargement...</p>
              ) : orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 hover:border-orange-200 transition-colors cursor-pointer group">
                      <div>
                        <p className="font-black text-[10px] uppercase text-slate-400">Réf: {order.id.slice(0,8)}</p>
                        <p className="font-bold text-slate-900">{order.total?.toLocaleString()} FCFA</p>
                      </div>
                      <ChevronRight size={18} className="text-slate-300 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest leading-loose">
                    Aucune commande trouvée<br/>pour le moment
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* PRIVILÈGES & RÉDUCTIONS */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <Ticket className="text-orange-600" size={20} />
              <h3 className="font-black uppercase tracking-widest text-xs text-slate-900">Bons & Réductions</h3>
            </div>
            
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
              <div className="relative overflow-hidden bg-orange-600 rounded-3xl p-6 text-white group cursor-pointer">
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Code de bienvenue</p>
                  <h4 className="text-3xl font-black italic tracking-tighter mb-4">GOAT10</h4>
                  <div className="bg-white/20 backdrop-blur-md py-2 px-4 rounded-xl inline-block">
                    <p className="text-[10px] font-bold uppercase">-10% SUR TOUT</p>
                  </div>
                </div>
                {/* Décoration de fond */}
                <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
              </div>
              
              <p className="mt-6 text-[10px] text-slate-400 font-bold uppercase leading-relaxed px-2 text-center">
                Les nouveaux membres bénéficient de réductions exclusives sur les articles Digital.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile; // <-- VÉRIFIE BIEN CETTE LIGNE