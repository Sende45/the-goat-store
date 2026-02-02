import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="min-h-screen bg-white pt-24 pb-20 px-4 md:px-8">
      {/* En-tête de la page */}
      <div className="max-w-7xl mx-auto mb-12">
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-slate-400 hover:text-orange-600 transition-colors mb-6 text-xs font-bold uppercase tracking-widest"
        >
          <ArrowLeft size={14} /> Retour au shop
        </Link>
        
        <div className="flex items-end gap-4">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-slate-900">
            Mes Coups <span className="text-orange-600 text-stroke">de Cœur</span>
          </h1>
          <div className="mb-2 bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black">
            {wishlist.length} ITEMS
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {wishlist.length > 0 ? (
          /* Grille des produits favoris */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {wishlist.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>
        ) : (
          /* État vide si aucun favori */
          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-3xl">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Heart size={32} className="text-slate-200" />
            </div>
            <h2 className="text-xl font-black uppercase tracking-tight text-slate-900 mb-2">
              Ta liste est vide
            </h2>
            <p className="text-slate-400 text-sm mb-8 text-center max-w-xs font-medium">
              Enregistre les articles que tu aimes pour les retrouver facilement ici.
            </p>
            <Link 
              to="/" 
              className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-orange-600 transition-all flex items-center gap-3 shadow-xl active:scale-95"
            >
              <ShoppingBag size={16} /> Explorer la collection
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;