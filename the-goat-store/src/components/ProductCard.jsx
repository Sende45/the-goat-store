import React from 'react';
import { ShoppingBag, Download, ArrowRight, Plus, Ruler, Sparkles } from 'lucide-react'; 
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ id, name, price, category, image, type, subCategory, stock, sizes }) => {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const cleanCategory = category?.toLowerCase().trim() || "";
  const cleanSub = subCategory?.toLowerCase().trim() || "";
  
  const isClothing = cleanCategory.includes("vêtement") || cleanCategory.includes("habit") || cleanCategory.includes("vetement");
  const isShoes = cleanCategory.includes("chaussure") || cleanCategory.includes("basket") || cleanCategory.includes("sneaker");
  const isDigital = cleanCategory === "digital" || type === "digital" || ["consoles", "téléphones", "accessoires"].includes(cleanSub);
  
  const needsSize = isClothing || isShoes || (sizes && sizes.length > 0);

  const handleAction = (e) => {
    e.preventDefault();
    if (stock === 0) return;
    if (needsSize) {
      navigate(`/product/${id}`);
    } else {
      addToCart({ id, name, price, image, category, type });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      {/* IMAGE CONTAINER */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#F8FAFC] rounded-[2rem] mb-5 shadow-sm transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-orange-100/50">
        
        <Link to={`/product/${id}`} className="block h-full w-full">
          <img 
            src={image || "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=800"} 
            alt={name}
            loading="lazy"
            className={`w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110 ${stock === 0 ? 'grayscale opacity-40' : ''}`}
          />
        </Link>
        
        {/* BADGES HAUT */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
          <div className="flex gap-2">
            <span className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-[1000] tracking-widest uppercase shadow-sm text-slate-900 border border-white/20">
              {subCategory || category}
            </span>
            {(type === 'digital' || isDigital) && (
              <span className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[9px] font-[1000] flex items-center gap-1.5 shadow-lg">
                <Download size={10} className="text-orange-500" /> DIGITAL
              </span>
            )}
          </div>
          {stock > 0 && stock <= 5 && (
            <span className="bg-orange-600 text-white px-3 py-1.5 rounded-xl text-[9px] font-[1000] flex items-center gap-1.5 animate-bounce shadow-lg shadow-orange-200">
              <Sparkles size={10} /> STOCK LIMITÉ
            </span>
          )}
        </div>

        {/* SOLD OUT OVERLAY */}
        {stock === 0 && (
          <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] flex items-center justify-center p-6 pointer-events-none">
            <span className="border-2 border-slate-900 text-slate-900 px-6 py-2 font-[1000] uppercase text-xs tracking-[0.3em] rotate-[-12deg] bg-white/80">
              Épuisé
            </span>
          </div>
        )}

        {/* BOUTON ACTION RAPIDE (OVERLAY) */}
        <div className="absolute bottom-5 left-5 right-5 translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 ease-out z-20">
          <button 
            disabled={stock === 0}
            onClick={handleAction}
            className={`w-full py-4 rounded-2xl font-[1000] uppercase text-[10px] tracking-[0.2em] flex items-center justify-center gap-3 shadow-2xl transition-all active:scale-95 ${
              stock === 0 
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
              : 'bg-slate-900 text-white hover:bg-orange-600'
            }`}
          >
            {stock === 0 ? 'OUT OF STOCK' : needsSize ? <><Ruler size={14} /> Choisir Taille</> : <><Plus size={14} /> Vite au panier</>}
          </button>
        </div>
      </div>

      {/* INFOS PRODUIT */}
      <div className="space-y-3 px-2">
        {/* Titre */}
        <Link to={`/product/${id}`} className="block">
          <h3 className="text-slate-900 font-[1000] uppercase text-[13px] tracking-tight leading-tight group-hover:text-orange-600 transition-colors line-clamp-1">
            {name}
          </h3>
        </Link>
        
        {/* Prix & Tailles */}
        <div className="flex flex-col gap-2">
          <div className="flex items-end gap-3">
              <span className="text-slate-900 font-[1000] text-lg tracking-tighter leading-none">
                {Number(price).toLocaleString()} <span className="text-[10px] font-black ml-0.5 uppercase">F</span>
              </span>
              <span className="text-slate-400 line-through text-[11px] font-bold italic mb-0.5">
                {(price * 1.2).toLocaleString()} F
              </span>
          </div>

          <div className="flex items-center justify-between">
            {needsSize ? (
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
                <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {sizes?.length > 0 ? `${sizes[0]} — ${sizes[sizes.length-1]}` : (isShoes ? "36 — 45" : "XS — 3XL")}
                </span>
              </div>
            ) : (
              <span className="text-[9px] font-black text-green-600 uppercase tracking-widest bg-green-50 px-2 py-0.5 rounded">
                Disponible immédiatement
              </span>
            )}
            
            <Link to={`/product/${id}`} className="text-slate-300 group-hover:text-orange-600 transition-colors">
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;