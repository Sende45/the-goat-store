import React, { useState } from 'react';
import { X, Truck, MessageCircle, Trash2, ShoppingBag, RefreshCw, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { createOrder } from '../utils/orderService';
import { motion, AnimatePresence } from 'framer-motion';

const COMMunes = [
  { name: "Cocody (Angré, Riviera, II Plateaux)", price: 2000 },
  { name: "Marcory / Zone 4", price: 2000 },
  { name: "Plateau", price: 1500 },
  { name: "Yopougon", price: 3000 },
  { name: "Abobo", price: 3000 },
  { name: "Koumassi / Treichville", price: 2000 },
];

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, cartTotal, removeFromCart } = useCart();
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [selectedCommune, setSelectedCommune] = useState("");
  const [loading, setLoading] = useState(false);

  const finalTotal = cartTotal + deliveryFee;

  const sendWhatsApp = async () => {
    if (deliveryFee === 0 && cart.length > 0) return;
    setLoading(true);
    try {
      const orderId = await createOrder(cart, cartTotal, deliveryFee, selectedCommune, auth.currentUser);
      if (orderId) {
        const trackingUrl = `${window.location.origin}/track/${orderId}`;
        const phoneNumber = "2250767793120"; 
        const message = `*NOUVELLE COMMANDE G.S #${orderId.slice(0, 5)}* 🐐\n\n` + 
          cart.map(item => `▪️ ${item.name}${item.size ? ` (Taille: ${item.size})` : ''} (x${item.quantity}) - ${item.price.toLocaleString()} FCFA`).join('\n') +
          `\n\n*Sous-total :* ${cartTotal.toLocaleString()} FCFA` +
          `\n*Livraison (${selectedCommune}) :* ${deliveryFee.toLocaleString()} FCFA` +
          `\n*TOTAL : ${finalTotal.toLocaleString()} FCFA*` +
          `\n\n📍 *SUIVRE ICI :* ${trackingUrl}`;
        
        window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        onClose();
      }
    } catch (e) { alert("Erreur de connexion."); } finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000] flex justify-end">
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Drawer */}
          <motion.div 
            initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full sm:max-w-[440px] bg-white h-full shadow-[-20px_0_50px_rgba(0,0,0,0.1)] flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-slate-900 p-2.5 rounded-xl">
                    <ShoppingBag size={20} className="text-white" />
                </div>
                <div>
                    <h2 className="text-xl font-[1000] uppercase tracking-tighter text-slate-900">Panier</h2>
                    <p className="text-[10px] font-black text-orange-500 uppercase tracking-widest">{cart.length} Articles</p>
                </div>
              </div>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
                <X size={20} className="text-slate-900" />
              </button>
            </div>

            {/* Items List */}
            <div className="flex-grow overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                  <ShoppingBag size={60} strokeWidth={1} className="mb-4" />
                  <p className="font-black uppercase text-xs tracking-[0.2em]">Votre panier est vide</p>
                </div>
              ) : (
                cart.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                    key={`${item.id}-${item.size}`} className="flex gap-4 group"
                  >
                    <div className="h-24 w-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="flex-grow flex flex-col justify-between py-1">
                      <div className="flex justify-between">
                        <div>
                          <h3 className="text-[13px] font-[1000] uppercase leading-tight text-slate-900">{item.name}</h3>
                          {item.size && <span className="inline-block mt-1 px-2 py-0.5 bg-orange-50 text-orange-600 text-[9px] font-black rounded-md uppercase">Taille {item.size}</span>}
                        </div>
                        <button onClick={() => removeFromCart(item.id, item.size)} className="text-slate-300 hover:text-red-500 transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex justify-between items-end">
                        <span className="text-[11px] font-bold text-slate-400 italic">x{item.quantity}</span>
                        <span className="text-base font-black text-slate-900">{(item.price * item.quantity).toLocaleString()} F</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

            {/* Bottom Actions */}
            {cart.length > 0 && (
              <div className="p-6 bg-slate-50/50 backdrop-blur-sm border-t border-slate-100 space-y-6">
                {/* Delivery Selector */}
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                            <Truck size={14} /> Livraison Abidjan
                        </span>
                        {deliveryFee > 0 && <span className="text-[10px] font-black text-green-500 uppercase italic">Prêt à partir</span>}
                    </div>
                    <select 
                        className="w-full bg-white border-2 border-slate-100 px-4 py-4 rounded-2xl text-[13px] font-bold outline-none focus:border-slate-900 transition-all cursor-pointer shadow-sm"
                        onChange={(e) => {
                            const val = parseInt(e.target.value);
                            const com = COMMunes.find(c => c.price === val);
                            setDeliveryFee(val); setSelectedCommune(com?.name || "");
                        }}
                    >
                        <option value="0">Sélectionner ma commune...</option>
                        {COMMunes.map((c, i) => <option key={i} value={c.price}>{c.name} (+{c.price} F)</option>)}
                    </select>
                </div>

                {/* Totals */}
                <div className="space-y-3 border-y border-slate-100 py-4">
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Sous-total</span>
                    <span>{cartTotal.toLocaleString()} F</span>
                  </div>
                  <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Frais de port</span>
                    <span className={deliveryFee > 0 ? "text-slate-900" : "italic text-orange-400"}>
                        {deliveryFee > 0 ? `+ ${deliveryFee.toLocaleString()} F` : "Non défini"}
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center px-1">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Total à payer</span>
                  <span className="text-3xl font-[1000] text-slate-900 tracking-tighter italic">
                    {finalTotal.toLocaleString()} <span className="text-xs not-italic font-black text-orange-500 ml-1">FCFA</span>
                  </span>
                </div>

                {/* Checkout Button */}
                <motion.button 
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={sendWhatsApp}
                  disabled={deliveryFee === 0 || loading}
                  className={`w-full py-5 rounded-2xl font-black text-[11px] tracking-[0.3em] flex items-center justify-center gap-3 transition-all duration-300 ${
                    (deliveryFee === 0 || loading)
                    ? "bg-slate-100 text-slate-300 cursor-not-allowed" 
                    : "bg-slate-900 text-white shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)] hover:bg-black"
                  }`}
                >
                  {loading ? <RefreshCw size={18} className="animate-spin" /> : <MessageCircle size={18} fill="currentColor" />}
                  {loading ? "TRAITEMENT..." : "FINALISER SUR WHATSAPP"}
                  <ChevronRight size={16} className={loading ? "hidden" : "ml-2 opacity-50"} />
                </motion.button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;