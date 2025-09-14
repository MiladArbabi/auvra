// src/context/CartContext.js
'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createCart, addToCartLines, getCart } from '@/lib/shopify';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  // On initial load, try to retrieve a cart from local storage
  useEffect(() => {
    const cartId = localStorage.getItem('cartId');
    if (cartId) {
      getCart(cartId).then(retrievedCart => {
        // Verify the cart still exists in Shopify
        if (retrievedCart) {
          setCart(retrievedCart);
        } else {
          localStorage.removeItem('cartId');
        }
      });
    }
  }, []);

  const addToCart = async (variantId, quantity) => {
    let newCart;
    if (cart) {
      // If a cart already exists, add a new line to it
      newCart = await addToCartLines(cart.id, variantId, quantity);
    } else {
      // If no cart exists, create a new one
      newCart = await createCart(variantId, quantity);
    }
    
    // Update state and local storage
    setCart(newCart);
    localStorage.setItem('cartId', newCart.id);
    setIsOpen(true);
    console.log('Cart updated:', newCart); // For debugging
  };

  // TODO: Implement removeFromCart and updateQuantity
  const removeFromCart = (lineId) => console.log('TODO: Remove from cart', { lineId });
  const updateQuantity = (lineId, newQuantity) => console.log('TODO: Update quantity', { lineId, newQuantity });

  const value = {
    cart,
    isOpen,
    setIsOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}