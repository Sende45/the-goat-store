import { useState, useEffect, Suspense, lazy } from 'react'; // Ajout de Suspense et lazy
import { Routes, Route, Navigate } from 'react-router-dom'; 
import { auth } from './firebase'; 
import { onAuthStateChanged } from 'firebase/auth';

// Composants critiques (chargés immédiatement)
import Header from './components/Header';
import Sidebar from './components/Sidebar'; 
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext'; 

// --- OPTIMISATION : Lazy Loading pour les pages lourdes ---
const Home = lazy(() => import('./pages/Home'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Commander = lazy(() => import('./pages/Commander'));
const Admin = lazy(() => import('./pages/Admin'));
const Auth = lazy(() => import('./pages/Auth'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const Profile = lazy(() => import('./pages/Profile'));
const Favorites = lazy(() => import('./pages/Favorites'));
const OrderTracking = lazy(() => import('./components/OrderTracking'));

// Petit composant de chargement fluide
const PageLoader = () => (
  <div className="h-[60vh] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [user, setUser] = useState(null); 
  const [loading, setLoading] = useState(true); 
  
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

  // Optimisation du blocage de scroll (plus fluide)
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    if (isCartOpen || isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    }
    return () => { document.body.style.overflow = originalStyle; };
  }, [isCartOpen, isSidebarOpen]);

  const isAdmin = user && user.email?.trim().toLowerCase() === "yohannesende@gmail.com";

  const handleCategorySelection = (cat) => {
    if (cat === 'All') {
      setActiveCategory(initialCategory);
    } else {
      const mainCats = ["Vêtements", "Chaussures", "Digital"];
      const type = mainCats.includes(cat) ? 'cat' : 'sub';
      setActiveCategory({ type: type, value: cat });
    }
  };

  return (
    <WishlistProvider>
      <CartProvider>
        <div className="font-sans antialiased text-slate-900 flex flex-col min-h-screen bg-white max-w-[2560px] mx-auto overflow-x-hidden">
          
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
            onCategorySelect={handleCategorySelection}
            onReset={handleResetHome}
          />
          
          <main className="flex-grow w-full pt-16 md:pt-20">
            {/* Suspense permet d'afficher un loader pendant que la page charge au lieu de tout bloquer */}
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home searchQuery={searchQuery} activeCategory={activeCategory} />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/commander" element={<Commander />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/profile" element={<Profile />} />
                
                <Route 
                  path="/admin-gs" 
                  element={
                    loading ? <PageLoader /> : isAdmin ? <Admin /> : <Navigate to="/login" replace />
                  } 
                />
                
                <Route path="/favoris" element={<Favorites />} />
                <Route path="/track/:orderId" element={<OrderTracking />} />
              </Routes>
            </Suspense>
          </main>

          <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
          <Footer />
        </div>
      </CartProvider>
    </WishlistProvider>
  );
}

export default App;