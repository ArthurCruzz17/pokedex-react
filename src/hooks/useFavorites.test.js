import { describe, it, expect, beforeEach } from 'vitest';
import { createElement } from 'react';
import { renderHook, act } from '@testing-library/react';
import { FavoritesProvider, useFavorites } from '../hooks/useFavorites';

function wrapper({ children }) {
  return createElement(FavoritesProvider, null, children);
}

const STORAGE_KEY = 'pokedex-favorites';

describe('useFavorites', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('adiciona e remove favoritos', () => {
    const pokemon = { id: 1, name: 'bulbasaur', types: ['grass'] };
    const { result } = renderHook(() => useFavorites(), { wrapper });

    expect(result.current.favorites).toEqual([]);

    act(() => result.current.toggleFavorite(pokemon));
    expect(result.current.isFavorite(1)).toBe(true);
    expect(result.current.favorites).toHaveLength(1);

    act(() => result.current.toggleFavorite(pokemon));
    expect(result.current.isFavorite(1)).toBe(false);
    expect(result.current.favorites).toHaveLength(0);
  });

  it('persiste favoritos no localStorage', () => {
    const pokemon = { id: 7, name: 'squirtle', types: ['water'] };
    const { result } = renderHook(() => useFavorites(), { wrapper });

    act(() => result.current.toggleFavorite(pokemon));

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY));
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(7);
  });
});
