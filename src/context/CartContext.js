// src/context/CartContext.js
'use client';

import { createContext, useContext, useState } from 'react';

// 1. Create the context
const CartContext = createContext();

// 2. Create the Provider component
export function CartProvider({ children }) {
  const [cart, setCart] = useState(null); // Will hold the cart object from Shopify
  const [isOpen, setIsOpen] = useState(false); // Controls the cart drawer's visibility

  // TODO: Implement these functions to call the Shopify Storefront API
  const addToCart = (variantId, quantity) => {
    console.log('TODO: Add to cart', { variantId, quantity });
    setIsOpen(true);
  };

  const removeFromCart = (lineId) => {
    console.log('TODO: Remove from cart', { lineId });
  };

  const updateQuantity = (lineId, newQuantity) => {
    console.log('TODO: Update quantity', { lineId, newQuantity });
  };

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

// 3. Create a custom hook for easy access
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}