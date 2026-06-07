'use client';

import { createContext, useContext, useReducer, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext(null);

const GUEST_KEY = 'vestige-cart';

function sameLine(a, b) {
  return a.id === b.id && a.size === b.size && a.color === b.color;
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_ITEMS':
      return { ...state, items: Array.isArray(action.items) ? action.items : [] };
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => sameLine(i, action.item));
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            sameLine(i, action.item) ? { ...i, quantity: i.quantity + action.item.quantity } : i
          ),
        };
      }
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter((i) => !sameLine(i, action)) };
    case 'UPDATE_QUANTITY':
      if (action.quantity <= 0) {
        return { ...state, items: state.items.filter((i) => !sameLine(i, action)) };
      }
      return {
        ...state,
        items: state.items.map((i) => (sameLine(i, action) ? { ...i, quantity: action.quantity } : i)),
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'OPEN_CART':
      return { ...state, isOpen: true };
    case 'CLOSE_CART':
      return { ...state, isOpen: false };
    default:
      return state;
  }
}

const initialState = { items: [], isOpen: false };

// Union two carts by line (id+size+color), summing quantities.
function mergeCarts(a, b) {
  const out = [...a];
  for (const item of b) {
    const match = out.find((i) => sameLine(i, item));
    if (match) match.quantity += item.quantity;
    else out.push({ ...item });
  }
  return out;
}

export default function CartProvider({ children }) {
  const { data: session, status } = useSession();

  const [state, dispatch] = useReducer(cartReducer, initialState, (init) => {
    // Seed with the guest cart from localStorage (only meaningful while logged out;
    // it is replaced once an authenticated user's server cart loads).
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(GUEST_KEY);
      if (saved) {
        try {
          return { ...init, items: JSON.parse(saved) };
        } catch {
          return init;
        }
      }
    }
    return init;
  });

  const itemsRef = useRef(state.items);
  itemsRef.current = state.items;
  const hydratedRef = useRef(false); // true once the user's server cart is loaded
  const saveTimer = useRef(null);

  // React to auth changes: load on login, clear on logout.
  useEffect(() => {
    let cancelled = false;

    if (status === 'authenticated') {
      (async () => {
        try {
          const res = await fetch('/api/cart');
          const data = await res.json();
          const serverItems = Array.isArray(data.items) ? data.items : [];
          // Merge any guest items added before logging in, then persist.
          const merged = mergeCarts(serverItems, itemsRef.current);
          if (cancelled) return;
          dispatch({ type: 'SET_ITEMS', items: merged });
          hydratedRef.current = true;
          localStorage.removeItem(GUEST_KEY); // server is now the source of truth
          await fetch('/api/cart', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: merged }),
          });
        } catch {
          // If the cart fails to load, leave the current items in place.
          hydratedRef.current = true;
        }
      })();
    } else if (status === 'unauthenticated') {
      // Logging out clears the cart (in memory + local).
      hydratedRef.current = false;
      dispatch({ type: 'CLEAR_CART' });
      if (typeof window !== 'undefined') localStorage.removeItem(GUEST_KEY);
    }

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id]);

  // Persist cart changes: to the DB while authenticated, to localStorage while a guest.
  useEffect(() => {
    if (status === 'authenticated') {
      if (!hydratedRef.current) return; // don't overwrite the server cart before it loads
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        fetch('/api/cart', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items: state.items }),
        }).catch(() => {});
      }, 500);
    } else if (status === 'unauthenticated') {
      if (typeof window !== 'undefined') localStorage.setItem(GUEST_KEY, JSON.stringify(state.items));
    }
    // 'loading' → do nothing yet
  }, [state.items, status]);

  const itemCount = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', item });
  const removeItem = (id, size, color) => dispatch({ type: 'REMOVE_ITEM', id, size, color });
  const updateQuantity = (id, size, color, quantity) =>
    dispatch({ type: 'UPDATE_QUANTITY', id, size, color, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' });
  const openCart = () => dispatch({ type: 'OPEN_CART' });
  const closeCart = () => dispatch({ type: 'CLOSE_CART' });

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
}
