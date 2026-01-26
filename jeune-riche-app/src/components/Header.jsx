import React, { useState } from 'react';
import { ShoppingBag, User, Search, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const Header = ({ onOpenCart, onSearch, onOpenSidebar, onLogoClick, user }) => { 
  const { cartCount } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  return (
    /* MODIFICATION : Changement de sticky à fixed + ajout de w-full et top-0 */
    <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between relative">
        
        {/* BOUTON CATALOGUE */}
        {!isSearchOpen && (
          <button 
            onClick={onOpenSidebar} 
            className="flex items-center gap-2 hover:text-orange-600 transition-colors group shrink-0"
          >
            <Menu className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden md:block font-black uppercase text-[10px] tracking-widest">Catalogue</span>
          </button>
        )}

        {/* Logo Central */}
        <Link 
          to="/" 
          onClick={() => {
            onLogoClick();
            setIsSearchOpen(false);
          }}
          className={`${isSearchOpen ? 'hidden md:flex' : 'flex'} absolute left-1/2 -translate-x-1/2 flex-col items-center hover:opacity-80 transition-opacity z-10`}
        >
          <h1 className="text-base md:text-2xl font-black italic tracking-tighter uppercase whitespace-nowrap">
            GOAT<span className="text-orange-600 underline decoration-2">STORE</span>
          </h1>
        </Link>
        
        <div className={`flex items-center space-x-1 md:space-x-5 ${isSearchOpen ? 'w-full md:w-auto justify-end' : ''}`}>
          
          {/* BARRE DE RECHERCHE */}
          {isSearchOpen ? (
            <div className="flex items-center bg-slate-100 px-3 md:px-4 py-2 rounded-xl md:rounded-2xl w-full md:w-64 animate-in slide-in-from-right-5 duration-300">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input 
                autoFocus
                type="text" 
                placeholder="Rechercher..."
                className="bg-transparent border-none outline-none w-full px-2 md:px-3 text-[11px] md:text-xs font-bold"
                onChange={(e) => onSearch(e.target.value)}
              />
              <button onClick={() => { setIsSearchOpen(false); onSearch(""); }} className="shrink-0">
                <X className="w-4 h-4 text-slate-400 hover:text-orange-600" />
              </button>
            </div>
          ) : (
            <div className="p-2 hover:bg-slate-50 rounded-full cursor-pointer transition-all" onClick={() => setIsSearchOpen(true)}>
               <Search className="w-5 h-5 text-slate-700 hover:text-orange-600 transition-colors" />
            </div>
          )}

          {/* AUTHENTICATION */}
          {!isSearchOpen && (
            <Link to={user ? "/profile" : "/login"} className="p-1.5 md:p-2 hover:bg-slate-50 rounded-full transition-all group shrink-0">
              {user ? (
                <div className="flex items-center">
                   <div className="w-7 h-7 md:w-8 md:h-8 bg-orange-100 rounded-full flex items-center justify-center border border-orange-200">
                      <User className="w-3.5 h-3.5 md:w-4 md:h-4 text-orange-600" />
                   </div>
                </div>
              ) : (
                <User className="w-5 h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-orange-600" />
              )}
            </Link>
          )}

          {/* Panier */}
          {!isSearchOpen && (
            <div className="relative cursor-pointer p-1.5 md:p-2 hover:bg-slate-50 rounded-full transition-all group shrink-0" onClick={onOpenCart}>
              <ShoppingBag className="w-5 h-5 md:w-6 md:h-6 text-slate-700 group-hover:text-orange-600" />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 md:top-1 md:right-1 bg-orange-600 text-white text-[8px] md:text-[9px] w-3.5 h-3.5 md:w-4 md:h-4 rounded-full flex items-center justify-center font-bold animate-pulse">
                  {cartCount}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;