import React, { createContext, useState, useContext } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Fonction pour ajouter au panier
  const addToCart = (product) => {
    setCart((prevCart) => {
      // On vérifie si le produit est déjà dans le panier
      const exists = prevCart.find((item) => item.id === product.id);
      if (exists) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });

    // MODIFICATION : J'ai supprimé la ligne alert(...) 
    // C'est cette suppression qui empêche le navigateur d'afficher son popup gris.
  };

  // --- TOUTES TES AUTRES MODIFICATIONS SONT CONSERVÉES ICI ---

  // Supprimer un article du panier (pour le bouton poubelle)
  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  // Vider complètement le panier (utile après une commande réussie)
  const clearCart = () => {
    setCart([]);
  };

  // Calcul du montant total
  const cartTotal = cart.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);

  // Nombre d'articles total
  const cartCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  return (
    <CartContext.Provider value={{ 
      cart, 
      addToCart, 
      removeFromCart, 
      clearCart,      
      cartTotal, 
      cartCount 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);