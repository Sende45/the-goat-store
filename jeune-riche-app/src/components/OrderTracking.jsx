import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock } from 'lucide-react';

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const steps = [
    { id: 'pending', label: 'Confirmée', icon: Clock },
    { id: 'processing', label: 'Préparation', icon: Package },
    { id: 'shipped', label: 'En route', icon: Truck },
    { id: 'delivered', label: 'Livrée', icon: CheckCircle },
  ];

  useEffect(() => {
    const fetchOrder = async () => {
      const docRef = doc(db, "orders", orderId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) setOrder(docSnap.data());
      setLoading(false);
    };
    fetchOrder();
  }, [orderId]);

  if (loading) return <div className="h-screen flex items-center justify-center font-black italic">CHARGEMENT GOAT...</div>;
  if (!order) return <div className="h-screen flex items-center justify-center">Commande introuvable.</div>;

  // On trouve l'index de l'étape actuelle (par défaut 'pending')
  const currentStepIndex = steps.findIndex(s => s.id === (order.status || 'pending'));

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-md mx-auto bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100">
        <h1 className="text-2xl font-black uppercase italic tracking-tighter mb-2">Suivi Commande</h1>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">Réf: #{orderId.slice(0, 8)}</p>

        <div className="space-y-8 relative">
          {/* Ligne verticale de fond */}
          <div className="absolute left-[19px] top-2 bottom-2 w-0.5 bg-slate-100" />

          {steps.map((step, index) => {
            const isCompleted = index <= currentStepIndex;
            const isCurrent = index === currentStepIndex;
            const Icon = step.icon;

            return (
              <div key={step.id} className="flex items-center gap-6 relative">
                <div className={`z-10 w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                  isCompleted ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-300'
                } ${isCurrent ? 'ring-4 ring-orange-100 scale-110' : ''}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-widest ${isCompleted ? 'text-slate-900' : 'text-slate-300'}`}>
                    {step.label}
                  </p>
                  {isCurrent && <p className="text-[10px] text-orange-600 font-bold italic mt-1 animate-pulse">Action en cours...</p>}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-slate-50">
          <p className="text-[10px] font-black text-slate-400 uppercase mb-4">Récapitulatif</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-sm font-black uppercase">{order.items?.length} Articles</p>
              <p className="text-xs text-slate-500 font-bold">{order.selectedCommune}</p>
            </div>
            <p className="text-xl font-black text-slate-900 tracking-tighter">{order.finalTotal?.toLocaleString()} F</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;