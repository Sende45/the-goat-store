import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock, ChevronLeft, MapPin, ReceiptText } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    { id: 'pending', label: 'Confirmée', desc: 'Commande reçue', icon: Clock },
    { id: 'processing', label: 'Préparation', desc: 'Contrôle qualité GS', icon: Package },
    { id: 'shipped', label: 'En route', desc: 'Livreur en chemin', icon: Truck },
    { id: 'delivered', label: 'Livrée', desc: 'Profite bien !', icon: CheckCircle },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const docRef = doc(db, "orders", orderId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) setOrder(docSnap.data());
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-12 h-12 border-4 border-slate-100 border-t-orange-600 rounded-full animate-spin mb-4" />
      <p className="font-[1000] uppercase tracking-widest text-[10px]">Recherche du colis...</p>
    </div>
  );

  if (!order) return (
    <div className="h-screen flex flex-col items-center justify-center p-6 text-center">
      <div className="bg-red-50 p-4 rounded-full mb-4 text-red-500"><ReceiptText size={32} /></div>
      <h2 className="text-xl font-black uppercase italic tracking-tighter">Commande introuvable</h2>
      <Link to="/" className="mt-6 text-orange-600 font-black uppercase text-xs tracking-widest underline">Retour au shop</Link>
    </div>
  );

  const currentStepIndex = steps.findIndex(s => s.id === (order.status || 'pending'));

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6">
      <div className="max-w-xl mx-auto">
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-8">
            <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors">
                <ChevronLeft size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest">Retour</span>
            </Link>
            <div className="text-right">
                <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">Statut en temps réel</p>
                <h1 className="text-xl font-[1000] uppercase italic tracking-tighter text-slate-900">Suivi GOATSTORE</h1>
            </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-10 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] border border-slate-100 relative overflow-hidden">
          {/* Réf & Date */}
          <div className="flex justify-between items-start mb-12">
            <div>
              <p className="text-slate-400 text-[9px] font-black uppercase tracking-widest mb-1">Numéro de commande</p>
              <p className="text-lg font-[1000] text-slate-900">#{orderId.slice(0, 8).toUpperCase()}</p>
            </div>
            <div className="bg-slate-900 text-white px-4 py-2 rounded-xl">
                <p className="text-[8px] font-black uppercase tracking-widest opacity-60">Total payé</p>
                <p className="text-sm font-black italic">{order.finalTotal?.toLocaleString()} F</p>
            </div>
          </div>

          {/* Stepper Vertical */}
          <div className="space-y-10 relative">
            {/* Ligne de progression dynamique */}
            <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />
            <motion.div 
              initial={{ height: 0 }}
              animate={{ height: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
              className="absolute left-[19px] top-2 w-0.5 bg-orange-600 z-0"
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {steps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              const Icon = step.icon;

              return (
                <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.2 }}
                    key={step.id} 
                    className="flex items-start gap-6 relative"
                >
                  <div className={`z-10 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-700 ${
                    isCompleted ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' : 'bg-slate-100 text-slate-300'
                  } ${isCurrent ? 'ring-4 ring-orange-50 scale-110' : ''}`}>
                    <Icon size={18} strokeWidth={isCurrent ? 3 : 2} />
                  </div>
                  
                  <div className="flex-1">
                    <p className={`text-xs font-[1000] uppercase tracking-widest transition-colors duration-500 ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                      {step.label}
                    </p>
                    <p className={`text-[10px] font-bold mt-0.5 ${isCurrent ? 'text-orange-600 italic' : 'text-slate-400 opacity-60'}`}>
                        {step.desc}
                    </p>
                    {isCurrent && (
                        <motion.div 
                            initial={{ width: 0 }} animate={{ width: "20px" }}
                            className="h-1 bg-orange-600 mt-2 rounded-full"
                        />
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Details Recap */}
          <div className="mt-16 bg-slate-50 rounded-3xl p-6 border border-slate-100 border-dashed">
            <div className="flex items-center gap-3 mb-4">
                <MapPin size={16} className="text-orange-600" />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Destination</span>
            </div>
            <p className="text-sm font-black text-slate-900 uppercase tracking-tighter italic">{order.selectedCommune}</p>
            <p className="text-[10px] text-slate-500 font-bold mt-1">Livrable à Abidjan sous 24h.</p>
          </div>
        </div>

        {/* Footer Support */}
        <div className="mt-8 flex items-center justify-center gap-6">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Besoin d'aide ?</p>
            <a 
                href={`https://wa.me/2250767793120?text=Bonjour, j'aimerais avoir plus d'infos sur ma commande GS #${orderId.slice(0,5)}`}
                className="text-[10px] font-[1000] text-orange-600 uppercase tracking-widest hover:underline"
            >
                Contact WhatsApp
            </a>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;