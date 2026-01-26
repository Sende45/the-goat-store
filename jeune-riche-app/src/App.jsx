import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; 
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// Composants
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Commander from './pages/Commander'; 
import Sidebar from './components/Sidebar'; 
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import OrderTracking from './components/OrderTracking'; // Import du suivi de commande
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; 

// Pages
import Admin from './pages/Admin';
import Auth from './pages/Auth'; 
import ContactPage from './pages/ContactPage'; 
import Profile from './pages/Profile';
import Favorites from './pages/Favorites';
import { uploadAllProducts } from "./seed-fix"; 

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [user, setUser] = useState(null); 
  
  const initialCategory = { type: 'All', value: 'La Collection' };
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleResetHome = () => {
    setActiveCategory(initialCategory);
    setSearchQuery("");
  };

  useEffect(() => {
    if (isCartOpen || isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isCartOpen, isSidebarOpen]);

  return (
    <WishlistProvider>
      <CartProvider>
        <div className="font-sans antialiased text-slate-900 flex flex-col min-h-screen bg-white">
          
          {/* Bouton de Synchronisation (Utile en dev) */}
          <button 
            onClick={() => {
              if(window.confirm("Voulez-vous écraser l'ancien catalogue par le nouveau catalogue PREMIUM ?")) {
                uploadAllProducts();
              }
            }}
            className="fixed bottom-6 right-6 z-[9999] bg-orange-600 text-white px-4 py-2 rounded-full text-[10px] font-black shadow-2xl hover:scale-110 transition-transform"
          >
            🔄 SYNC CATALOGUE JR
          </button>

          <Header 
            onOpenCart={() => setIsCartOpen(true)} 
            onSearch={setSearchQuery} 
            onOpenSidebar={() => setIsSidebarOpen(true)} 
            onLogoClick={handleResetHome}
            user={user}
          />

          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            onCategorySelect={(cat) => setActiveCategory({ type: 'filter', value: cat })}
            onReset={handleResetHome}
          />
          
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} activeCategory={activeCategory} />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/commander" element={<Commander />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/admin-gs" element={<Admin />} />
              <Route path="/favoris" element={<Favorites />} />
              <Route path="/track/:orderId" element={<OrderTracking />} />
            </Routes>
          </main>

          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          
          <Footer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;