// src/components/cart/CartDrawer.js
'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { formatMoney } from '@/lib/market-utils';
import { X, ShoppingBag } from 'lucide-react';
import CartLineItem from './CartLineItem';

export default function CartDrawer() {
  const { isOpen, setIsOpen, cart } = useCart();
  const subtotal = cart?.cost?.subtotalAmount;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-background z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b auvra-border">
          <h2 className="text-lg font-semibold uppercase tracking-wider">Shopping Cart</h2>
          <button onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X size={24} />
          </button>
        </div>

        {/* Cart Content */}
        <div className="flex-grow p-4 overflow-y-auto">
          {!cart || cart.lines.edges.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag size={48} className="text-foreground/50" />
              <p className="mt-4 text-foreground/80">Your cart is empty.</p>
            </div>
          ) : (
           <ul className="-my-4 divide-y divide-gray-200">
              {cart.lines.edges.map(edge => (
                <CartLineItem key={edge.node.id} line={edge.node} />
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t auvra-border space-y-4">
          <div className="flex justify-between font-semibold">
            <span>Subtotal</span>
            {/* TODO: Display the actual subtotal */}
            <span>{subtotal ? formatMoney(subtotal.amount, subtotal.currencyCode) : '$0.00'}</span>
          </div>
          <Link
          href={cart?.checkoutUrl || '/'}            
          className="block w-full text-center p-3 rounded-md bg-primary text-background"
          >
            Go to Checkout
          </Link>
        </div>
      </div>
    </>
  );
}