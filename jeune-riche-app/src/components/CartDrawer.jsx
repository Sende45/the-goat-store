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
        // window.location.origin récupère l'adresse de ton site (localhost ou ton futur lien Vercel)
        const trackingUrl = `${window.location.origin}/track/${orderId}`;

        // --- TON NUMÉRO (Format strict sans + ni espaces pour éviter les erreurs WhatsApp) ---
        const phoneNumber = "2250767793120"; 
        
        // Construction du message avec l'ajout du LIEN DE SUIVI
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
        
        // Encodage sécurisé du message
        const encodedMessage = encodeURIComponent(message);
        
        // Utilisation de wa.me (plus moderne et stable)
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        
        // 2. Ouverture de WhatsApp
        window.open(whatsappUrl, '_blank');
        
        // Fermer le panier après succès
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
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Header */}
        <div className="p-6 border-b flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <ShoppingBag size={20} className="text-orange-500" />
            <h2 className="text-xl font-black uppercase tracking-tighter">Mon Panier</h2>
            <span className="bg-orange-600 text-[10px] px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
          <button onClick={onClose} className="hover:rotate-90 transition-transform duration-300">
            <X size={24} />
          </button>
        </div>

        {/* Liste */}
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                <ShoppingBag className="text-slate-200" size={32} />
              </div>
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Ton panier est vide</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 group">
                <div className="h-20 w-20 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm font-black uppercase leading-tight max-w-[150px]">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-xs font-bold text-slate-400">QTÉ: {item.quantity}</span>
                    <span className="text-sm font-black text-orange-600">{(item.price * item.quantity).toLocaleString()} FCFA</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 bg-slate-50 border-t space-y-4">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block tracking-widest flex items-center gap-2">
                <Truck size={14} /> Destination (Abidjan)
              </label>
              <select 
                disabled={loading}
                className="w-full p-4 border-none rounded-2xl mb-4 text-sm font-bold bg-white shadow-sm focus:ring-2 focus:ring-orange-500 outline-none appearance-none"
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
            </div>

            <div className="space-y-2 border-b border-slate-200 pb-4 text-xs font-bold text-slate-500 uppercase">
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
              <span className="text-lg font-black uppercase tracking-tighter">Total Final</span>
              <span className="text-2xl font-black text-slate-900 tracking-tighter">
                {finalTotal.toLocaleString()} <span className="text-xs">FCFA</span>
              </span>
            </div>

            <button 
              onClick={sendWhatsApp}
              disabled={deliveryFee === 0 || loading}
              className={`w-full py-5 rounded-2xl font-black text-xs tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-xl active:scale-95 ${
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;