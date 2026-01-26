import { X, Truck, MessageCircle, Trash2, ShoppingBag, RefreshCw } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useState } from 'react';
import { auth } from '../firebase';
import { createOrder } from '../utils/orderService'; 

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

  if (!isOpen) return null;

  const finalTotal = cartTotal + deliveryFee;

  const sendWhatsApp = async () => {
    if (deliveryFee === 0 && cart.length > 0) {
      alert("S'il te plaît, sélectionne ta commune pour la livraison !");
      return;
    }

    setLoading(true);

    try {
      // 1. Enregistrement en base de données
      const orderId = await createOrder(
        cart,
        cartTotal,
        deliveryFee,
        selectedCommune,
        auth.currentUser
      );

      if (orderId) {
        // --- CONFIGURATION DU LIEN DE SUIVI ---
        const trackingUrl = `${window.location.origin}/track/${orderId}`;

        // --- TON NUMÉRO ---
        const phoneNumber = "2250767793120"; 
        
        const message = `*NOUVELLE COMMANDE G.S #${orderId.slice(0, 5)}* 🐐\n\n` + 
          cart.map(item => `▪️ ${item.name} (x${item.quantity}) - ${item.price.toLocaleString()} FCFA`).join('\n') +
          `\n\n--------------------------` +
          `\n*Sous-total :* ${cartTotal.toLocaleString()} FCFA` +
          `\n*Livraison (${selectedCommune}) :* ${deliveryFee.toLocaleString()} FCFA` +
          `\n*TOTAL À PAYER : ${finalTotal.toLocaleString()} FCFA*` +
          `\n--------------------------` +
          `\n\n📍 *SUIVRE MON COLIS :*` +
          `\n${trackingUrl}` + 
          `\n\n_Client : ${auth.currentUser?.email || 'Invité'}_` +
          `\n_Livrable à Abidjan sous 24h._`;
        
        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        onClose();
      }
    } catch (error) {
      console.error("Erreur commande:", error);
      alert("Erreur lors de la validation. Vérifie ta connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop adaptable */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      {/* Panier : w-full sur mobile, max-w-md sur tablette/PC */}
      <div className="relative w-full sm:max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header Responsive */}
        <div className="p-4 md:p-6 border-b flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-orange-500" />
            <h2 className="text-lg md:text-xl font-black uppercase tracking-tighter">Mon Panier</h2>
            <span className="bg-orange-600 text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
          <button onClick={onClose} className="p-2 hover:rotate-90 transition-transform duration-300">
            <X size={24} />
          </button>
        </div>

        {/* Liste des articles - Scrollable */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Ton panier est vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group animate-in fade-in slide-in-from-bottom-2">
                <div className="h-16 w-16 md:h-20 md:w-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xs md:text-sm font-black uppercase leading-tight max-w-[120px] md:max-w-[150px]">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 p-1 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-[10px] md:text-xs font-bold text-slate-400">QTÉ: {item.quantity}</span>
                    <span className="text-sm font-black text-orange-600">{(item.price * item.quantity).toLocaleString()} F</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Responsive avec calculs */}
        {cart.length > 0 && (
          <div className="p-4 md:p-6 bg-slate-50 border-t space-y-4">
            <div>
              <label className="text-[9px] md:text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest flex items-center gap-2">
                <Truck size={14} /> Destination (Abidjan)
              </label>
              <div className="relative">
                <select 
                  disabled={loading}
                  className="w-full p-3 md:p-4 border-none rounded-xl md:rounded-2xl mb-2 text-xs md:text-sm font-bold bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none appearance-none cursor-pointer"
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const commune = COMMunes.find(c => c.price === val);
                    setDeliveryFee(val);
                    setSelectedCommune(commune ? commune.name : "");
                  }}
                >
                  <option value="0">Où doit-on livrer ?</option>
                  {COMMunes.map((c, i) => (
                    <option key={i} value={c.price}>{c.name} (+{c.price} F)</option>
                  ))}
                </select>
                <div className="absolute right-4 top-4 pointer-events-none opacity-50">▼</div>
              </div>
            </div>

            <div className="space-y-2 border-b border-slate-200 pb-4 text-[10px] font-bold text-slate-500 uppercase">
              <div className="flex justify-between">
                <span>Sous-total</span>
                <span>{cartTotal.toLocaleString()} FCFA</span>
              </div>
              <div className="flex justify-between">
                <span>Livraison</span>
                <span className={deliveryFee > 0 ? "text-orange-600" : ""}>
                  {deliveryFee > 0 ? `+${deliveryFee.toLocaleString()} FCFA` : "À sélectionner"}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center py-2">
              <span className="text-base md:text-lg font-black uppercase tracking-tighter">Total Final</span>
              <span className="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">
                {finalTotal.toLocaleString()} <span className="text-[10px]">FCFA</span>
              </span>
            </div>

            <button 
              onClick={sendWhatsApp}
              disabled={deliveryFee === 0 || loading}
              className={`w-full py-4 md:py-5 rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
                (deliveryFee === 0 || loading)
                ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                : "bg-[#25D366] text-white hover:bg-[#1fb355] shadow-green-100"
              }`}
            >
              {loading ? (
                <RefreshCw size={20} className="animate-spin" />
              ) : (
                <MessageCircle size={20} fill="currentColor" />
              )}
              {loading ? "TRAITEMENT..." : "VALIDER VIA WHATSAPP"}
            </button>
            <p className="text-center text-[8px] text-slate-400 uppercase tracking-widest">Paiement à la livraison</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;