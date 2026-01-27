import React from 'react';
import { Shirt, Smartphone, Footprints, ChevronRight, X, LayoutGrid } from 'lucide-react';

// AJOUT DE LA PROP onReset ICI
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
      {/* 1. OVERLAY - Flou plus prononcé pour la concentration visuelle */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60] transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* 2. SIDEBAR */}
      <div className={`fixed inset-y-0 left-0 z-[70] w-85 bg-white shadow-2xl transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } transition-transform duration-300 ease-in-out`}>
        
        {/* Header - Contraste élevé */}
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <h2 className="text-xl font-black text-gray-900 tracking-tight uppercase">
            G.S <span className="text-orange-600">Catalogue</span>
          </h2>
          <button 
            onClick={onClose} 
            aria-label="Fermer le menu"
            className="p-3 hover:bg-gray-100 rounded-full transition-colors text-gray-900"
          >
            <X size={28} />
          </button>
        </div>
        
        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-140px)]">
          {/* MODIF : Le bouton utilise onReset pour vraiment tout réinitialiser sur Home */}
          <button 
            onClick={() => { onReset(); onClose(); }}
            className="flex items-center gap-3 w-full p-4 mb-4 font-black text-xs uppercase tracking-widest text-white bg-black rounded-xl hover:bg-orange-600 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-gray-200 group"
          >
            <LayoutGrid size={20} className="group-hover:rotate-90 transition-transform duration-300" /> 
            Voir tout l'univers G.S
          </button>

          {categories.map((cat) => (
            <div key={cat.name} className="space-y-1 mb-6">
              {/* MODIF : La catégorie parente est maintenant un bouton cliquable */}
              <button 
                onClick={() => { onCategorySelect(cat.name); onClose(); }}
                className="flex items-center gap-3 w-full p-4 font-black text-gray-900 bg-gray-50 rounded-xl border border-gray-100 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
              >
                <span className="text-orange-600">{cat.icon}</span>
                <span className="flex-1 text-left uppercase text-xs tracking-[0.15em]">{cat.name}</span>
                <ChevronRight size={14} className="text-gray-400" />
              </button>
              
              <div className="ml-6 flex flex-col space-y-1 border-l-4 border-orange-100 pl-4 mt-3 animate-in slide-in-from-left-2 duration-300">
                {cat.sub.map(s => (
                  <button 
                    key={s}
                    onClick={() => { 
                        onCategorySelect(s); 
                        onClose(); 
                    }}
                    className="flex items-center justify-between w-full p-3 text-sm font-bold text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all group"
                  >
                    <span className="text-[15px]">{s}</span>
                    <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all text-orange-600" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer - Texte plus lisible */}
        <div className="absolute bottom-0 w-full p-6 border-t bg-white text-[11px] text-gray-500 font-black uppercase tracking-widest text-center">
          GOATSTORE Premium Edition • 2026
        </div>
      </div>
    </>
  );
};

export default Sidebar;