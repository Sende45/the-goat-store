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
          // MODIF : On cherche dans 'category' (utilisé par l'admin) 
          // OU 'subCategory' (pour tes anciens produits)
          // La solution la plus propre ici est de viser le champ 'category' que tu gères maintenant
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
    <>
      {/* 1. HERO SECTION */}
      <section className="relative h-[60vh] flex items-center justify-center bg-[#0f172a] mt-16">
        <div className="relative z-10 text-center px-4">
          <span className="text-orange-500 font-bold tracking-[0.8em] text-[9px] uppercase mb-4 block">L'ÉLITE D'ABIDJAN</span>
          <h2 className="text-[10vw] md:text-[8rem] font-black text-white leading-none uppercase tracking-tighter opacity-90">
            {activeCategory?.value || 'La Collection'}
          </h2>
        </div>
      </section>

      {/* 2. GRILLE PRODUITS */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-8 h-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chargement...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-[2rem] border border-dashed border-slate-200">
            <ShoppingBag size={40} className="mx-auto text-slate-200 mb-4" />
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sold Out</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {filteredProducts.map(product => (
               <ProductCard key={product.id} {...product} />
            ))}
          </div>
        )}
      </section>

      {/* 3. MANIFESTE */}
      <section className="py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="mx-auto text-orange-600 mb-8 opacity-20" size={48} />
          <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-6">Manifeste GOATSTORE</h3>
          <p className="text-lg text-slate-600 leading-relaxed font-medium italic">
            "Plus qu'une boutique, un standard de vie. Nous sélectionnons uniquement le meilleur du digital et de la mode 
            pour ceux qui visent le sommet. Soyez le GOAT."
          </p>
        </div>
      </section>

      {/* 4. NEWSLETTER */}
      <section className="py-32 bg-[#0f172a] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-600/10 blur-[120px] rounded-full"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Mail className="mx-auto text-orange-500 mb-8" size={40} />
          <h4 className="text-4xl font-black uppercase tracking-tighter mb-6">Rejoignez le Club GOAT</h4>
          <p className="mb-8 text-slate-400 text-sm uppercase tracking-[0.3em]">Accès prioritaire aux nouveautés</p>
          <form className="flex flex-col md:flex-row gap-4 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Ton email premium" 
              className="flex-1 bg-white/5 border border-white/10 px-8 py-5 rounded-2xl focus:outline-none focus:border-orange-500 transition-all text-white" 
            />
            <button className="bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xs px-10 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-600/20">
              S'inscrire <Send size={16} />
            </button>
          </form>
        </div>
      </section>
    </>
  );
};

export default Home;