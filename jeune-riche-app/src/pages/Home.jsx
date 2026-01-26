import { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Mail, Quote, Send } from 'lucide-react';

// IMPORTATION DE LA FONCTION SEED
import { uploadAllProducts } from '../seed-fix'; 

const Home = ({ searchQuery = "", activeCategory = { type: 'All', value: 'La Collection' } }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. ATTACHEMENT DE LA FONCTION SEED À LA CONSOLE
  useEffect(() => {
    window.uploadGoat = uploadAllProducts;
    console.log("🚀 GOATSTORE : Tapez uploadGoat() dans la console pour remplir le catalogue.");
  }, []);

  // 2. RÉCUPÉRATION DES PRODUITS (MODIFIÉ POUR CORRESPONDRE À L'ADMIN)
  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory || !activeCategory.type) return;

      setLoading(true);
      try {
        let q = collection(db, "products");
        
        if (activeCategory.type !== 'All') {
          q = query(q, where("category", "==", activeCategory.value));
        }
        
        const querySnapshot = await getDocs(q);
        setProducts(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) { 
        console.error("Erreur Firebase Home:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProducts();
  }, [activeCategory]);

  const filteredProducts = products.filter(p => 
    p.name?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      {/* 1. HERO SECTION - Adaptée pour toutes les tailles d'écran */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-[#0f172a] mt-16 overflow-hidden">
        {/* Effet de lumière en fond pour les grands écrans/TV */}
        <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent"></div>
        
        <div className="relative z-10 text-center px-4 w-full max-w-[2000px] mx-auto">
          <span className="text-orange-500 font-bold tracking-[0.4em] md:tracking-[0.8em] text-[8px] md:text-[10px] uppercase mb-4 block animate-pulse">
            L'ÉLITE D'ABIDJAN
          </span>
          <h2 className="text-[12vw] md:text-[10vw] lg:text-[8rem] xl:text-[10rem] font-black text-white leading-none uppercase tracking-tighter opacity-90 break-words px-2">
            {activeCategory?.value || 'La Collection'}
          </h2>
        </div>
      </section>

      {/* 2. GRILLE PRODUITS - Full Responsive de 1 à 5 colonnes (TV) */}
      <section className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-10 py-12 md:py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chargement du stock...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200 mx-4">
            <ShoppingBag size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sold Out</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-8">
            {filteredProducts.map(product => (
               <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. MANIFESTE - Centré pour tablettes et TV */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="mx-auto text-orange-600 mb-6 md:mb-8 opacity-20" size={32} md={48} />
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-6">
            Manifeste GOATSTORE
          </h3>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed font-medium italic">
            "Plus qu'une boutique, un standard de vie. Nous sélectionnons uniquement le meilleur du digital et de la mode 
            pour ceux qui visent le sommet. Soyez le GOAT."
          </p>
        </div>
      </section>

      {/* 4. NEWSLETTER - Adaptée Mobile/Desktop/TV */}
      <section className="py-20 md:py-32 bg-[#0f172a] text-white overflow-hidden relative">
        {/* Décoration pour grands écrans */}
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-orange-600/10 blur-[100px] md:blur-[120px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/5 blur-[80px] rounded-full"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Mail className="mx-auto text-orange-500 mb-6 md:mb-8" size={32} md={40} />
          <h4 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-4 md:mb-6">
            Rejoignez le Club GOAT
          </h4>
          <p className="mb-8 md:mb-12 text-slate-400 text-[10px] md:text-sm uppercase tracking-[0.2em] md:tracking-[0.3em]">
            Accès prioritaire aux nouveautés
          </p>
          
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto px-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Ton email premium" 
              className="w-full flex-1 bg-white/5 border border-white/10 px-6 md:px-8 py-4 md:py-5 rounded-xl md:rounded-2xl focus:outline-none focus:border-orange-500 transition-all text-white text-sm" 
            />
            <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[10px] md:text-xs px-8 md:px-10 py-4 md:py-5 rounded-xl md:rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-600/20 whitespace-nowrap">
              S'inscrire <Send size={16} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;