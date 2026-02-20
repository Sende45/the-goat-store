import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Header = ({ onOpenCart, onSearch, onOpenSidebar, onLogoClick, user }) => { 
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-[1000] bg-white/80 backdrop-blur-xl border-b border-slate-100 shadow-[0_2px_15px_-10px_rgba(0,0,0,0.05)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 md:h-20 flex items-center justify-between relative">
        
        {/* SECTION GAUCHE : CATALOGUE (Caché si recherche mobile active) */}
        <AnimatePresence>
          {!isSearchOpen && (
            <motion.button 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={onOpenSidebar} 
              className="flex items-center gap-3 hover:text-orange-600 transition-all group shrink-0"
            >
              <div className="p-2 group-hover:bg-orange-50 rounded-xl transition-colors">
                <Menu className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
              </div>
              <span className="hidden lg:block font-[1000] uppercase text-[10px] tracking-[0.2em] text-slate-900">Catalogue</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* LOGO CENTRAL (Caché si recherche mobile active) */}
        <Link 
          to="/" 
          onClick={() => {
            onLogoClick();
            setIsSearchOpen(false);
          }}
          className={`${isSearchOpen ? 'hidden md:flex' : 'flex'} absolute left-1/2 -translate-x-1/2 flex-col items-center hover:scale-105 transition-transform z-10`}
        >
          <h1 className="text-lg md:text-2xl font-[1000] italic tracking-tighter uppercase whitespace-nowrap text-slate-900">
            GOAT<span className="text-orange-600">STORE</span>
            <div className="h-0.5 w-full bg-orange-600 scale-x-50 group-hover:scale-x-100 transition-transform origin-center mt-[-2px]" />
          </h1>
        </Link>
        
        {/* SECTION DROITE : ACTIONS */}
        <div className={`flex items-center gap-1 md:gap-4 ${isSearchOpen ? 'w-full md:w-auto' : ''}`}>
          
          {/* BARRE DE RECHERCHE ANIMÉE */}
          <div className={`flex items-center transition-all duration-500 ${isSearchOpen ? 'w-full md:w-80' : 'w-10 md:w-12'}`}>
            <AnimatePresence mode="wait">
              {isSearchOpen ? (
                <motion.div 
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="flex items-center bg-slate-100/80 px-4 py-2.5 rounded-2xl w-full border border-slate-200/50"
                >
                  <Search className="w-4 h-4 text-slate-400 shrink-0" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Chercher un article..."
                    className="bg-transparent border-none outline-none w-full px-3 text-[12px] font-bold text-slate-900 placeholder:text-slate-400"
                    onChange={(e) => onSearch(e.target.value)}
                  />
                  <button onClick={() => { setIsSearchOpen(false); onSearch(""); }}>
                    <X className="w-4 h-4 text-slate-400 hover:text-orange-600 transition-colors" />
                  </button>
                </motion.div>
              ) : (
                <button 
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 hover:bg-slate-50 rounded-xl transition-all"
                >
                  <Search className="w-5 h-5 md:w-6 md:h-6 text-slate-900" />
                </button>
              )}
            </AnimatePresence>
          </div>

          {/* AUTHENTICATION & PANIER (Cachés sur mobile si recherche active) */}
          {!isSearchOpen && (
            <div className="flex items-center gap-1 md:gap-4">
              <Link to={user ? "/profile" : "/login"} className="p-2.5 hover:bg-slate-50 rounded-xl transition-all group">
                {user ? (
                   <div className="w-8 h-8 md:w-9 md:h-9 bg-slate-900 rounded-full flex items-center justify-center border-2 border-white shadow-sm overflow-hidden">
                      <User className="w-4 h-4 text-white" />
                   </div>
                ) : (
                  <User className="w-5 h-5 md:w-6 md:h-6 text-slate-900 group-hover:text-orange-600 transition-colors" />
                )}
              </Link>

              <button 
                onClick={onOpenCart}
                className="relative p-2.5 hover:bg-slate-50 rounded-xl transition-all group"
              >
                <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-slate-900 group-hover:text-orange-600 transition-colors" />
                {cartCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 bg-orange-600 text-white text-[9px] w-4.5 h-4.5 min-w-[18px] px-1 rounded-full flex items-center justify-center font-black border-2 border-white shadow-sm">
                    {cartCount}
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;