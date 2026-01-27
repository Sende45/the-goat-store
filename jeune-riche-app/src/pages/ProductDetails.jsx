import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShieldCheck, Truck, LayoutGrid, MessageCircle, Ruler, AlertTriangle } from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(""); 
  const { addToCart } = useCart();

  // --- PLAGES DE TAILLES PAR DÉFAUT ---
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL']; 
  const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

  // --- LOGIQUE DE DÉTECTION FLEXIBLE ---
  const rawCategory = product?.category || "";
  const cleanCategory = rawCategory.toLowerCase().trim()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); 

  const isClothing = cleanCategory.includes("vetement") || cleanCategory.includes("habit") || cleanCategory.includes("ensemble");
  const isShoes = cleanCategory.includes("chaussure") || cleanCategory.includes("basket");
  
  // MODIFICATION : besoins d'une taille si catégorie vêtement/chaussure OU si des tailles existent en BD
  const needsSize = isClothing || isShoes || (product?.sizes && product.sizes.length > 0);

  // --- LOGIQUE DE STOCK ---
  const stockCount = product?.stock !== undefined ? Number(product.stock) : 0;
  const isLowStock = stockCount > 0 && stockCount <= 5;

  // --- MODIFICATION : LOGIQUE DYNAMIQUE DES TAILLES ---
  // On utilise les tailles de la BD en priorité, sinon les listes par défaut
  const availableSizes = product?.sizes && product.sizes.length > 0 
    ? product.sizes 
    : (isShoes ? shoeSizes : clothingSizes);

  const handleWhatsAppOrder = () => {
    const phoneNumber = "2250767793120"; 
    const sizeText = selectedSize ? `\n*Taille:* ${selectedSize}` : "";
    const message = `Salut GOATSTORE ! 👋\nJe suis intéressé par cet article :\n\n*Produit:* ${product.name}${sizeText}\n*Prix:* ${Number(product.price).toLocaleString()} FCFA\n\nEst-ce qu'il est toujours disponible ?`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    const getProduct = async () => {
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() });
        }
      } catch (error) {
        console.error("Erreur récupération produit:", error);
      }
    };
    getProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (!product) return (
    <div className="h-screen flex flex-col items-center justify-center gap-4 bg-white" role="alert" aria-busy="true">
      <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-600 font-bold uppercase tracking-widest text-xs">L'Élite arrive...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* HERO SECTION - IMAGE */}
      <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center overflow-hidden bg-black">
        <div className="absolute inset-0">
          <img 
            src={product.image} 
            className="w-full h-full object-cover opacity-60 transition-transform duration-700 hover:scale-105" 
            alt={`Image de ${product.name}`}
            onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white"></div>
        </div>

        <div className="relative z-10 text-center px-4 mt-20">
          <button 
            onClick={() => navigate(-1)}
            className="absolute -top-24 left-4 flex items-center gap-2 text-white bg-black/50 hover:bg-black backdrop-blur-md px-5 py-2.5 rounded-full transition-all font-bold text-xs uppercase tracking-wider border border-white/20"
          >
            <ChevronLeft size={20} /> Retour
          </button>
          
          <span className="text-orange-400 font-black tracking-[0.3em] text-xs uppercase mb-4 block">
            {product.subCategory || "Exclusivité GOATSTORE"}
          </span>
          <h1 className="text-4xl md:text-7xl font-black text-white leading-tight uppercase tracking-tighter drop-shadow-lg">
            {product.name}
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-24 -mt-12 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* INFOS PRODUIT & TAILLES */}
          <div className="lg:col-span-7 space-y-8">
            
            {isLowStock && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 animate-pulse">
                <AlertTriangle className="text-red-600" size={20} />
                <p className="text-red-600 font-black uppercase text-[10px] tracking-widest">
                  Plus que {stockCount} articles disponibles !
                </p>
              </div>
            )}

            <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-200 shadow-sm">
              <h2 className="font-black uppercase text-xs tracking-widest text-slate-500 mb-6 flex items-center gap-2">
                <LayoutGrid size={18} aria-hidden="true" /> Détails & Style G.S
              </h2>
              <p className="text-slate-700 leading-relaxed text-xl font-medium">
                {product.description || "Une pièce d'exception sélectionnée par l'élite. Qualité supérieure et design intemporel."}
              </p>
            </div>

            {/* SÉLECTEUR DE TAILLES DYNAMIQUE */}
            {needsSize && (
              <fieldset className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex justify-between items-center mb-8 w-full">
                  <h2 className="font-black uppercase text-xs tracking-widest text-slate-900 flex items-center gap-2">
                    <Ruler size={18} className="text-orange-600" aria-hidden="true" /> 
                    {/* Titre dynamique selon la source des tailles */}
                    {product.sizes && product.sizes.length > 0 
                      ? "Tailles Disponibles" 
                      : (isShoes ? 'Pointures Disponibles (36-45)' : 'Tailles Disponibles (XS-3XL)')}
                  </h2>
                  {selectedSize && (
                    <span className="text-[10px] font-black text-orange-700 uppercase bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                      Sélection : {selectedSize}
                    </span>
                  )}
                </div>
                
                {/* flex-wrap permet de gérer n'importe quel nombre de tailles proprement */}
                <div className="flex flex-wrap gap-3">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-14 min-w-[3.5rem] px-4 flex items-center justify-center rounded-2xl font-bold text-sm transition-all duration-200 border-2
                        ${selectedSize === size 
                          ? 'border-orange-600 bg-orange-600 text-white shadow-lg scale-105' 
                          : 'border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-300'}`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-[1.5rem]">
                <div className="bg-orange-100 p-3 rounded-2xl text-orange-700"><Truck size={28} /></div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider">Livraison Express</h3>
                  <p className="text-sm text-slate-600 font-medium">Abidjan en 24h chrono.</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-6 bg-white border border-slate-200 rounded-[1.5rem]">
                <div className="bg-blue-100 p-3 rounded-2xl text-blue-700"><ShieldCheck size={28} /></div>
                <div>
                  <h3 className="font-black text-xs uppercase tracking-wider">Garantie GOAT</h3>
                  <p className="text-sm text-slate-600 font-medium">Authenticité certifiée.</p>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR D'ACHAT */}
          <aside className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 space-y-6">
              <div className="text-center">
                <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Tarif Privilège</span>
                <div className="text-6xl font-black text-slate-900 mt-2 tracking-tighter">
                  {Number(product.price).toLocaleString()} <span className="text-lg font-bold">FCFA</span>
                </div>
              </div>

              <div className="space-y-4">
                <button 
                  onClick={() => addToCart({ ...product, size: selectedSize })}
                  disabled={(needsSize && !selectedSize) || stockCount === 0}
                  className={`w-full py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all transform active:scale-95
                    ${((!needsSize || selectedSize) && stockCount > 0)
                      ? 'bg-black text-white hover:bg-orange-600 shadow-2xl' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed opacity-50'}`}
                >
                  {stockCount === 0 ? 'SOLD OUT' : (!needsSize || selectedSize) ? 'Ajouter au panier' : 'Choisir une taille'}
                </button>

                <button 
                  onClick={handleWhatsAppOrder}
                  className="w-full bg-[#128C7E] text-white py-6 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-[#075E54] transition-all shadow-lg active:scale-95"
                >
                  <MessageCircle size={22} fill="currentColor" />
                  Commander via WhatsApp
                </button>
              </div>

              <div className="pt-6 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase font-black tracking-widest">
                GOATSTORE Premium Service • 2026
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
};

export default ProductDetails;