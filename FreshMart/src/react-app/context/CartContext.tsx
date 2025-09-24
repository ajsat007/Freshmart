import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from '@getmocha/users-service/react';
import { Cart } from '@/shared/types';

interface CartContextValue {
  cart: Cart | null;
  isLoading: boolean;
  cartCount: number;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (itemId: number, quantity: number) => Promise<void>;
  removeFromCart: (itemId: number) => Promise<void>;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const cartCount = cart?.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const fetchCart = async () => {
    if (!user) {
      setCart(null);
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/cart');
      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!user) return;

    try {
      const response = await fetch('/api/cart/items', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ product_id: productId, quantity }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateCartItem = async (itemId: number, quantity: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  };

  const removeFromCart = async (itemId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`/api/cart/items/${itemId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCart();
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [user]);

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        cartCount,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
