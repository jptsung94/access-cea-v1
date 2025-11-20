import { create } from 'zustand';
import { Asset } from '@/types/access';

interface AccessCartState {
  cartItems: Asset[];
  addToCart: (asset: Asset) => void;
  removeFromCart: (assetId: string) => void;
  clearCart: () => void;
  isInCart: (assetId: string) => boolean;
}

export const useAccessCartStore = create<AccessCartState>((set, get) => ({
  cartItems: [],
  
  addToCart: (asset) => {
    const { cartItems, isInCart } = get();
    if (!isInCart(asset.id)) {
      set({ cartItems: [...cartItems, asset] });
    }
  },
  
  removeFromCart: (assetId) => {
    set((state) => ({
      cartItems: state.cartItems.filter((item) => item.id !== assetId),
    }));
  },
  
  clearCart: () => {
    set({ cartItems: [] });
  },
  
  isInCart: (assetId) => {
    return get().cartItems.some((item) => item.id === assetId);
  },
}));
