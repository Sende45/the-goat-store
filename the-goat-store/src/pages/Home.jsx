import React, { useState, useEffect, useMemo } from 'react';
import { db } from '../firebase'; 
import { collection, getDocs, query, where, limit } from "firebase/firestore";
import ProductCard from '../components/ProductCard';
import { ShoppingBag, Mail, Send, ArrowRight, Sparkles, Trophy, MousePointer2 } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';

const Home = ({ searchQuery = "", activeCategory = { type: 'All', value: 'La Collection' } }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetching optimisé avec limite pour le premier rendu
  useEffect(() => {
    const fetchProducts = async () => {
      if (!activeCategory?.type) return;
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
          stock: Number(doc.data().stock || 0),
        }));
        setProducts(productsData);
      } catch (error) { 
        console.error("Firebase Error:", error); 
      } finally { 
        setLoading(false); 
      }
    };
    fetchProducts();
  }, [activeCategory]);

  // 2. Mémorisation du filtrage (Performance)
  const filteredProducts = useMemo(() => {
    return products.filter(p => 
      p.name?.toLowerCase().includes(searchQuery?.toLowerCase() || "")
    );
  }, [products, searchQuery]);

  return (
    <div className="min-h-screen bg-white">
      
      {/* --- HERO SECTION : "THE GOAT EXPERIENCE" --- */}
      <section className="relative h-[85vh] flex items-center justify-center bg-[#020617] overflow-hidden">
        {/* Animated Mesh Background */}
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3] 
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 z-0"
        >
          <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full" />
        </motion.div>

        <div className="relative z-10 text-center px-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
          >
            <Trophy size={12} className="text-orange-500" />
            <span className="text-white font-black tracking-[0.4em] text-[9px] uppercase">
              Limited Edition Drops
            </span>
          </motion.div>

          <div className="overflow-hidden">
            <motion.h2 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[12vw] lg:text-[9rem] font-black text-white leading-[0.85] uppercase tracking-tighter"
            >
              {activeCategory?.value || 'GOAT'}
              <span className="text-orange-600 inline-block animate-pulse">.</span>
            </motion.h2>
          </div>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-8 text-slate-400 text-sm md:text-lg max-w-2xl mx-auto font-light leading-relaxed"
          >
            La destination ultime pour le streetwear de luxe et les pièces rares à Abidjan.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-12 flex flex-col items-center gap-4"
          >
            <div className="text-white/30 text-[9px] font-bold tracking-[0.5em] uppercase flex items-center gap-4">
              <span className="h-[1px] w-8 bg-white/20" />
              Scroll to explore
              <span className="h-[1px] w-8 bg-white/20" />
            </div>
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-5 h-8 border-2 border-white/20 rounded-full flex justify-center p-1"
            >
              <div className="w-1 h-1 bg-orange-500 rounded-full" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* --- GRILLE PRODUITS : "THE GRID" --- */}
      <section className="max-w-[1600px] mx-auto px-6 md:px-12 py-24">
        <div className="flex flex-wrap items-end justify-between mb-20 gap-8">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-orange-600 font-black text-xs uppercase tracking-[0.3em]">
              <Sparkles size={16} />
              <span>New Arrivals</span>
            </div>
            <h3 className="text-5xl md:text-7xl font-black text-slate-950 uppercase tracking-tighter">
              The Drop<span className="text-orange-600">.</span>
            </h3>
          </div>
          <div className="bg-slate-50 border border-slate-100 px-6 py-4 rounded-2xl">
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-widest">
              Available Units: <span className="text-slate-950">{filteredProducts.length}</span>
            </p>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loader"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="py-40 flex flex-col items-center justify-center gap-8"
            >
              <div className="w-20 h-20 border-w-2 border-orange-600/20 border-t-orange-600 rounded-full animate-spin border-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400">Loading Collection</span>
            </motion.div>
          ) : (
            <motion.div 
              key="grid"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                visible: { transition: { staggerChildren: 0.05 } }
              }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-20"
            >
              {filteredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  variants={{
                    hidden: { opacity: 0, y: 30 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="group relative"
                >
                  <ProductCard {...product} />
                  
                  {/* Metadata Overlay Design */}
                  <div className="mt-6 flex flex-col gap-4 border-l-2 border-slate-100 pl-4 group-hover:border-orange-500 transition-colors duration-500">
                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                      <span className="text-slate-400 italic font-medium">Availability</span>
                      <span className={product.stock > 0 ? "text-emerald-500" : "text-rose-500"}>
                        {product.stock > 0 ? `In Stock (${product.stock})` : 'Sold Out'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-full bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.6)]" />
                      <span className="text-[11px] font-bold text-slate-900 uppercase">
                        {product.subCategory || 'Original Series'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* --- CTA SECTION : NEWSLETTER --- */}
      <section className="mx-6 mb-12">
        <div className="max-w-[1400px] mx-auto rounded-[3rem] bg-[#020617] p-12 md:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-orange-600/10 to-transparent" />
          
          <div className="relative z-10 max-w-2xl">
            <h4 className="text-4xl md:text-6xl font-black text-white uppercase tracking-tighter mb-8 leading-tight">
              Don't miss the <br />
              <span className="text-orange-500 underline decoration-white/10">Next Drop.</span>
            </h4>
            <p className="text-slate-400 text-lg mb-12 font-medium">
              Rejoignez le cercle privé G.S et recevez les codes d'accès 24h avant la sortie officielle.
            </p>

            <form className="flex flex-col sm:flex-row gap-4 p-2 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10" onSubmit={e => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Elite@protocol.com"
                className="flex-1 bg-transparent px-6 py-4 outline-none text-white font-bold"
              />
              <button className="bg-white text-black hover:bg-orange-600 hover:text-white px-8 py-4 rounded-2xl font-black uppercase text-[11px] tracking-widest transition-all flex items-center justify-center gap-3">
                Join Squad <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;