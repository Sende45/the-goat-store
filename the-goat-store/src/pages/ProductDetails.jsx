import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { 
  ChevronLeft, ShieldCheck, Truck, LayoutGrid, 
  MessageCircle, Ruler, AlertTriangle, CheckCircle2, 
  Zap, Share2, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); 
  const [showToast, setShowToast] = useState(false);
  const { addToCart } = useCart();

  // Optimisation : On mémoïse les calculs de catégories pour éviter les recalculs inutiles
  const categoryStatus = useMemo(() => {
    if (!product) return { isClothing: false, isShoes: false };
    const clean = (product.category || "").toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return {
      isClothing: clean.includes("vetement") || clean.includes("habit") || clean.includes("ensemble"),
      isShoes: clean.includes("chaussure") || clean.includes("basket")
    };
  }, [product]);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    getProduct();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, size: selectedSize });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleWhatsAppOrder = () => {
    const phoneNumber = "2250767793120"; 
    const sizeText = selectedSize ? `\n*Taille:* ${selectedSize}` : "";
    const message = `Salut GOATSTORE ! 👋\nJe veux commander ceci :\n\n*Produit:* ${product.name}${sizeText}\n*Prix:* ${Number(product.price).toLocaleString()} FCFA\n\nEst-ce disponible ?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-10 h-10 border-2 border-orange-600 border-t-transparent rounded-full" />
    </div>
  );

  const stockCount = Number(product.stock || 0);
  const availableSizes = product.sizes?.length > 0 ? product.sizes : (categoryStatus.isShoes ? ['39','40','41','42','43','44','45'] : ['S','M','L','XL','XXL']);

  return (
    <main className="min-h-screen bg-[#FAFAFA] text-slate-900 pb-12">
      
      {/* TOAST NOTIFICATION MODERNE */}
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 -translate-x-1/2 z-[200] w-[90%] max-w-sm"
          >
            <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/10">
              <CheckCircle2 size={20} className="text-orange-500" />
              <p className="text-xs font-black uppercase tracking-widest">Ajouté avec succès !</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto md:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 md:gap-12">
          
          {/* SECTION IMAGE : COLLÉE AU BORD SUR MOBILE */}
          <div className="relative group">
            <button 
              onClick={() => navigate(-1)}
              className="absolute top-6 left-6 z-50 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-xl hover:scale-110 transition-transform"
            >
              <ChevronLeft size={20} />
            </button>
            
            <div className="aspect-[4/5] md:rounded-[3rem] overflow-hidden bg-white shadow-2xl">
              <img 
                src={product.image} 
                className="w-full h-full object-cover" 
                alt={product.name}
              />
            </div>

            {/* Badges Flottants */}
            <div className="absolute bottom-6 left-6 flex flex-wrap gap-2">
              <span className="bg-black text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest">
                New Drop
              </span>
              {stockCount <= 5 && stockCount > 0 && (
                <span className="bg-orange-600 text-white text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest animate-pulse">
                  Rare : {stockCount} restants
                </span>
              )}
            </div>
          </div>

          {/* SECTION INFOS */}
          <div className="p-6 md:p-0 flex flex-col justify-center">
            <div className="mb-8">
              <div className="flex items-center gap-2 text-orange-600 mb-4">
                <Zap size={14} fill="currentColor" />
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exclusivité GS Abidjan</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 uppercase tracking-tighter mb-4 leading-none">
                {product.name}
              </h1>
              <p className="text-3xl font-light text-slate-400 tracking-tighter">
                {Number(product.price).toLocaleString()} <span className="text-sm font-black uppercase">FCFA</span>
              </p>
            </div>

            {/* SÉLECTEUR DE TAILLE STYLE LUXE */}
            {(categoryStatus.isClothing || categoryStatus.isShoes) && (
              <div className="mb-10">
                <div className="flex justify-between items-center mb-4">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2">
                    <Ruler size={14} /> Choisir votre taille
                  </label>
                  <button className="text-[10px] font-black uppercase border-b border-slate-900 leading-none">Guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 w-14 md:h-16 md:w-16 rounded-2xl font-black text-sm transition-all flex items-center justify-center border-2
                        ${selectedSize === size ? 'border-orange-600 bg-orange-600 text-white' : 'border-slate-100 bg-white text-slate-900 hover:border-slate-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* DESCRIPTION ACCORDÉON */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <Info size={14} className="text-orange-500" /> Storytelling
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">
                {product.description || "Sélectionnée pour son caractère unique et sa qualité supérieure, cette pièce incarne l'esprit GOATSTORE."}
              </p>
            </div>

            {/* ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button 
                onClick={handleAddToCart}
                disabled={stockCount === 0 || ((categoryStatus.isShoes || categoryStatus.isClothing) && !selectedSize)}
                className={`group relative overflow-hidden py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] transition-all
                  ${stockCount === 0 ? 'bg-slate-100 text-slate-400' : 'bg-slate-900 text-white hover:bg-orange-600 shadow-xl'}`}
              >
                <span className="relative z-10">
                  {stockCount === 0 ? 'Sold Out' : (selectedSize || !categoryStatus.isShoes) ? 'Prendre maintenant' : 'Sélectionner Taille'}
                </span>
              </button>
              
              <button 
                onClick={handleWhatsAppOrder}
                className="py-6 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] bg-white border border-slate-200 flex items-center justify-center gap-3 hover:bg-slate-50 transition-all"
              >
                <MessageCircle size={18} /> Conciergerie WhatsApp
              </button>
            </div>

            {/* REASSURANCE */}
            <div className="mt-12 grid grid-cols-2 gap-4">
              <div className="flex flex-col items-center text-center p-4">
                <Truck size={20} className="mb-2 text-slate-300" />
                <p className="text-[8px] font-black uppercase tracking-tighter">Livraison VIP Abidjan</p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <ShieldCheck size={20} className="mb-2 text-slate-300" />
                <p className="text-[8px] font-black uppercase tracking-tighter">Authenticité 100%</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
};

export default ProductDetails;