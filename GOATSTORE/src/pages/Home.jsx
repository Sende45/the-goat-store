import React, { useState, useEffect } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where } from "firebase/firestore";
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Mail, Quote, Send } from 'lucide-react'; 
 

const Home = ({ searchQuery = "", activeCategory = { type: 'All', value: 'La Collection' } }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory || !activeCategory.type) return;
      setLoading(true);
      try {
        let q = collection(db, "products");
        
        if (activeCategory.type !== 'All') {
          const filterField = ["Vêtements", "Chaussures", "Digital"].includes(activeCategory.value) 
            ? "category" 
            : "subCategory";
            
          q = query(q, where(filterField, "==", activeCategory.value));
        }
        
        const querySnapshot = await getDocs(q);
        const productsData = querySnapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data(),
          stock: doc.data().stock !== undefined ? Number(doc.data().stock) : 0,
          image: doc.data().image || ""
        }));
        setProducts(productsData);
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
      {/* 1. HERO SECTION */}
      <section className="relative h-[50vh] md:h-[60vh] lg:h-[70vh] flex items-center justify-center bg-[#0f172a] mt-16 overflow-hidden">
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

      {/* 2. GRILLE PRODUITS */}
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
            {filteredProducts.map(product => {
                const cat = product.category?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") || "";
                const isShoe = cat.includes("chaussure");
                const isClothing = cat.includes("vetement") || cat.includes("habit") || cat.includes("ensemble");

                return (
                  <div key={product.id} className="group flex flex-col">
                     <ProductCard {...product} />
                     
                     {(isShoe || isClothing) && (
                       <div className="mt-3 px-2 flex items-center gap-2 animate-in fade-in duration-500">
                         <div className="h-[1px] flex-1 bg-slate-100 group-hover:bg-orange-100 transition-colors"></div>
                         <span className="text-[9px] font-black text-orange-600 uppercase tracking-[0.15em] whitespace-nowrap bg-orange-50/50 px-2 py-0.5 rounded-md border border-orange-100/50">
                           {isShoe ? 'Pointures : 36 — 45' : 'Tailles : XS — 3XL'}
                         </span>
                         <div className="h-[1px] flex-1 bg-slate-100 group-hover:bg-orange-100 transition-colors"></div>
                       </div>
                     )}

                     {(!isShoe && !isClothing) && (
                       <div className="mt-3 px-2 flex items-center gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                         <div className="h-[1px] flex-1 bg-slate-50"></div>
                         <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">Premium Edition</span>
                         <div className="h-[1px] flex-1 bg-slate-50"></div>
                       </div>
                     )}
                  </div>
                );
            })}
          </div>
        )}
      </section>

      {/* 3. MANIFESTE */}
      <section className="py-16 md:py-24 bg-slate-50 border-y border-slate-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Quote className="mx-auto text-orange-600 mb-6 md:opacity-20" size={32} />
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 uppercase tracking-tighter mb-6">
            Manifeste GOATSTORE
          </h3>
          <p className="text-base md:text-lg lg:text-xl text-slate-600 leading-relaxed font-medium italic">
            "Plus qu'une boutique, un standard de vie. Nous sélectionnons uniquement le meilleur du digital et de la mode pour ceux qui visent le sommet."
          </p>
        </div>
      </section>

      {/* 4. NEWSLETTER */}
      <section className="py-20 md:py-32 bg-[#0f172a] text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-orange-600/10 blur-[100px] rounded-full"></div>
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <Mail className="mx-auto text-orange-500 mb-8" size={32} />
          <h4 className="text-3xl md:text-4xl lg:text-5xl font-black uppercase tracking-tighter mb-6">Rejoignez le Club GOAT</h4>
          <form className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto px-2" onSubmit={(e) => e.preventDefault()}>
            <input type="email" placeholder="Ton email premium" className="w-full flex-1 bg-white/5 border border-white/10 px-6 py-4 rounded-xl focus:border-orange-500 transition-all text-white text-sm" />
            <button className="w-full sm:w-auto bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-[10px] px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-orange-600/20">
              S'inscrire <Send size={16} />
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;