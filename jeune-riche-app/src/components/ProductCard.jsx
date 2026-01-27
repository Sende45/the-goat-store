import React from 'react';
import { ShoppingCart, Download, ArrowRight, Plus, AlertCircle, Ruler } from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

// Ajout de "sizes" dans les arguments pour récupérer les tailles de la BD
const ProductCard = ({ id, name, price, category, image, type, subCategory, stock, sizes }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // --- LOGIQUE DE DÉTECTION ULTRA-STRICTE ---
  const cleanCategory = category?.toLowerCase().trim() || "";
  const isClothing = cleanCategory === "vêtements" || cleanCategory === "vetements" || cleanCategory === "vêtement" || cleanCategory.includes("habit");
  const isShoes = cleanCategory === "chaussures" || cleanCategory === "chaussure" || cleanCategory.includes("basket");
  
  // Modif : Un produit a besoin d'une taille si cat vêtement/chaussure OU s'il a des tailles définies en BD
  const needsSize = isClothing || isShoes || (sizes && sizes.length > 0);

  const handleImageError = (e) => {
    e.target.src = "https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=800&q=80";
  };

  const handleAction = (e) => {
    e.preventDefault();
    if (stock === 0) return;

    // Si le produit nécessite une taille, on redirige vers les détails au lieu d'ajouter directement
    if (needsSize) {
      navigate(`/product/${id}`);
    } else {
      addToCart({ id, name, price, image, category, type });
    }
  };

  return (
    <div className="group cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100 rounded-2xl mb-6 shadow-sm group-hover:shadow-xl transition-all duration-500">
        <Link to={`/product/${id}`} className="block h-full w-full">
          <img 
            src={image || "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800"} 
            alt={name}
            onError={handleImageError}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110 ${stock === 0 ? 'grayscale opacity-60' : ''}`}
          />
        </Link>
        
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black tracking-[0.2em] uppercase shadow-sm text-slate-900">
            {subCategory || category}
          </span>
          {type === 'digital' && (
            <span className="bg-orange-600 text-white px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg animate-pulse">
              <Download className="w-3 h-3" /> DIGITAL
            </span>
          )}
          {stock === 0 && (
            <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-[9px] font-black flex items-center gap-1 shadow-lg">
              SOLD OUT
            </span>
          )}
        </div>

        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        
        <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-75">
          <button 
            disabled={stock === 0}
            onClick={handleAction}
            className={`w-full py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 shadow-2xl transition-all active:scale-95 ${
              stock === 0 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
              : 'bg-white/95 backdrop-blur-md text-slate-900 hover:bg-orange-600 hover:text-white'
            }`}
          >
            {stock === 0 ? 'Indisponible' : needsSize ? <><Ruler size={14} /> Choisir ma taille</> : <><Plus size={14} /> Ajouter au panier</>}
          </button>
        </div>
      </div>

      <div className="space-y-2 px-1 text-center">
        <div className="h-4 flex items-center justify-center mb-1">
          {stock <= 5 && stock > 0 && (
            <div className="flex items-center gap-1 animate-pulse">
              <span className="w-1 h-1 bg-red-600 rounded-full"></span>
              <p className="text-[9px] font-black text-red-600 uppercase">Plus que {stock} articles !</p>
            </div>
          )}
        </div>

        <Link to={`/product/${id}`}>
          <h3 className="text-slate-900 font-black uppercase text-sm tracking-tighter leading-tight group-hover:text-orange-600 transition-colors line-clamp-2">
            {name}
          </h3>
        </Link>
        
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
              <span className="text-slate-400 line-through text-[10px] font-medium italic">
                {(price * 1.2).toLocaleString()} <span className="text-[8px]">FCFA</span>
              </span>
              <span className="text-slate-900 font-black text-base tracking-tighter">
                {Number(price).toLocaleString()} <span className="text-[10px] ml-0.5">FCFA</span>
              </span>
          </div>

          {/* AFFICHAGE DES PLAGES DE TAILLES (DYNAMIQUE) */}
          {needsSize && (
            <p className="text-[9px] font-black text-orange-600 uppercase tracking-widest mt-1 bg-orange-50 px-2 py-0.5 rounded-md border border-orange-100">
              {sizes && sizes.length > 0 
                ? `${sizes[0]} — ${sizes[sizes.length - 1]}` 
                : (isShoes ? "Pointures : 36 — 45" : "Tailles : XS — 3XL")
              }
            </p>
          )}
          
          <Link 
            to={`/product/${id}`}
            className="text-[9px] font-bold text-slate-300 uppercase tracking-[0.3em] hover:text-orange-500 transition-colors flex items-center gap-1 mt-1"
          >
            Détails <ArrowRight size={10} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;