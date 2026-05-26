import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

const STORAGE_KEY = 'pokedex-favorites';

const FavoritesContext = createContext(null);

function readStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(readStorage);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const isFavorite = useCallback(
    (id) => favorites.some((p) => p.id === id),
    [favorites]
  );

  const toggleFavorite = useCallback((pokemon) => {
    setFavorites((prev) => {
      const exists = prev.some((p) => p.id === pokemon.id);
      if (exists) {
        return prev.filter((p) => p.id !== pokemon.id);
      }
      return [...prev, pokemon];
    });
  }, []);

  const removeFavorite = useCallback((id) => {
    setFavorites((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const value = useMemo(
    () => ({ favorites, isFavorite, toggleFavorite, removeFavorite }),
    [favorites, isFavorite, toggleFavorite, removeFavorite]
  );

  return createElement(FavoritesContext.Provider, { value }, children);
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within FavoritesProvider');
  }
  return context;
}
