import React from 'react';
import { Shirt, Smartphone, Footprints, ChevronRight, X, LayoutGrid } from 'lucide-react';

const Sidebar = ({ isOpen, onClose, onCategorySelect, onReset }) => {
  const categories = [
    {
      name: "Digital",
      icon: <Smartphone className="w-5 h-5" />,
      sub: ["Téléphones", "Ordinateurs", "Consoles", "Accessoires"]
    },
    {
      name: "Vêtements",
      icon: <Shirt className="w-5 h-5" />,
      sub: ["Homme", "Femme", "Enfant"]
    },
    {
      name: "Chaussures",
      icon: <Footprints className="w-5 h-5" />,
      sub: ["Baskets", "Luxe", "Sport"]
    }
  ];

  return (
    <>
      {/* 1. OVERLAY - Adapté au tactile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 2. SIDEBAR - Largeur responsive : 85% sur mobile, max 350px sur PC */}
      <div className={`fixed inset-y-0 left-0 z-[110] w-[85%] sm:w-[350px] bg-white shadow-2xl transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-500 ease-in-out border-r border-gray-100`}>
        
        {/* Header - Fixe en haut pour mobile */}
        <div className="sticky top-0 p-5 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <h2 className="text-lg font-black text-gray-900 tracking-tight uppercase">
            G.S <span className="text-orange-600">Catalogue</span>
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-900 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>
        
        {/* Navigation - Scroll fluide sur mobile */}
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)] scrollbar-hide">
          
          <button 
            onClick={() => { onReset(); onClose(); }}
            className="flex items-center gap-3 w-full p-4 mb-6 font-black text-[10px] uppercase tracking-widest text-white bg-black rounded-2xl hover:bg-orange-600 active:scale-[0.98] transition-all shadow-lg shadow-gray-200 group"
          >
            <LayoutGrid size={18} className="group-hover:rotate-90 transition-transform duration-300" /> 
            Voir tout l'univers G.S
          </button>

          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1 mb-6">
              {/* Catégorie parente - Zone de clic agrandie pour les pouces */}
              <button 
                onClick={() => { onCategorySelect(cat.name); onClose(); }}
                className="flex items-center gap-3 w-full p-4 font-black text-gray-900 bg-gray-50 rounded-2xl border border-gray-100 active:bg-orange-50 transition-all duration-200"
              >
                <span className="text-orange-600">{cat.icon}</span>
                <span className="flex-1 text-left uppercase text-[10px] tracking-[0.15em]">{cat.name}</span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
              
              {/* Sous-catégories - Espacement optimisé pour mobile */}
              <div className="ml-4 flex flex-col space-y-1 border-l-2 border-orange-100 pl-4 mt-2">
                {cat.sub.map(s => (
                  <button 
                    key={s}
                    onClick={() => { 
                        onCategorySelect(s); 
                        onClose(); 
                    }}
                    className="flex items-center justify-between w-full p-3.5 text-sm font-bold text-gray-600 active:text-orange-600 active:bg-orange-50 rounded-xl transition-all group"
                  >
                    <span className="text-[14px]">{s}</span>
                    <ChevronRight size={16} className="opacity-40 text-orange-600" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - Fixe en bas */}
        <div className="absolute bottom-0 w-full p-5 border-t bg-gray-50 text-[9px] text-gray-400 font-black uppercase tracking-[0.2em] text-center">
          GOATSTORE Premium Edition • 2026
        </div>
      </div>
    </>
  );
};

export default Sidebar;