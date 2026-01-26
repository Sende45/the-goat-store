import { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // Ajout de Navigate pour la sécurité
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
  const [loading, setLoading] = useState(true); // Ajout d'un état de chargement auth
  
  const initialCategory = { type: 'All', value: 'La Collection' };
  const [activeCategory, setActiveCategory] = useState(initialCategory);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
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

  // --- MODIFICATION SÉCURITÉ ADMIN ---
  // Seul ton email pourra accéder à la page admin-gs
  const isAdmin = user && user.email === "yohannesende@gmail.com";

  return (
    <WishlistProvider>
      <CartProvider>
        {/* Ajout de max-w-[2000px] pour la responsivité sur TV */}
        <div className="font-sans antialiased text-slate-900 flex flex-col min-h-screen bg-white max-w-[2560px] mx-auto overflow-x-hidden">
          
          {/* Bouton de Synchronisation - Masqué sur mobile pour plus de clarté */}
          <button 
            onClick={() => {
              if(window.confirm("Voulez-vous écraser l'ancien catalogue par le nouveau catalogue PREMIUM ?")) {
                uploadAllProducts();
              }
            }}
            className="fixed bottom-6 right-6 z-[9999] bg-orange-600 text-white px-4 py-2 rounded-full text-[10px] font-black shadow-2xl hover:scale-110 transition-transform hidden md:block"
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
          
          <main className="flex-grow w-full">
            <Routes>
              <Route path="/" element={<Home searchQuery={searchQuery} activeCategory={activeCategory} />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/commander" element={<Commander />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/profile" element={<Profile />} />
              
              {/* Route Admin Sécurisée */}
              <Route 
                path="/admin-gs" 
                element={isAdmin ? <Admin /> : <Navigate to="/login" />} 
              />
              
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