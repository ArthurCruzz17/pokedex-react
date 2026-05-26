import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/search';
import TypeFilter from '../components/filter';
import PokemonGrid from '../components/grid';
import Loading from '../components/loading';
import ErrorMessage from '../components/error';
import {
  fetchPokemonList,
  fetchPokemonByName,
  fetchPokemonByType,
  fetchRandomPokemon,
} from '../services/pokeApi';
import { useFavorites } from '../hooks/useFavorites';
import { useDebounce } from '../hooks/useDebounce';

const PAGE_SIZE = 20;

export default function Home() {
  const navigate = useNavigate();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState([]);
  const [nextOffset, setNextOffset] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [mode, setMode] = useState('browse');
  const debouncedSearch = useDebounce(search, 450);
  const skipDebounce = useRef(true);
  const activeRequest = useRef(0);

  function beginRequest() {
    activeRequest.current += 1;
    return activeRequest.current;
  }

  function isStale(requestId) {
    return requestId !== activeRequest.current;
  }

  const loadPage = useCallback(async (startOffset, append = false) => {
    const requestId = beginRequest();
    if (append) setLoadingMore(true);
    else setInitialLoading(true);
    setError(null);
    try {
      const result = await fetchPokemonList(startOffset, PAGE_SIZE);
      if (isStale(requestId)) return;
      setPokemon((prev) => (append ? [...prev, ...result.pokemon] : result.pokemon));
      setNextOffset(result.nextOffset);
      setMode('browse');
    } catch (err) {
      if (isStale(requestId)) return;
      setError(err.message);
    } finally {
      if (!isStale(requestId)) {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  const loadByType = useCallback(async (type, startOffset = 0, append = false) => {
    const requestId = beginRequest();
    if (append) setLoadingMore(true);
    else setInitialLoading(true);
    setError(null);
    try {
      const result = await fetchPokemonByType(type, startOffset, PAGE_SIZE);
      if (isStale(requestId)) return;
      setPokemon((prev) => (append ? [...prev, ...result.pokemon] : result.pokemon));
      setNextOffset(result.nextOffset);
      setMode('type');
    } catch (err) {
      if (isStale(requestId)) return;
      setError(err.message);
    } finally {
      if (!isStale(requestId)) {
        setInitialLoading(false);
        setLoadingMore(false);
      }
    }
  }, []);

  const runSearch = useCallback(async (query) => {
    const trimmed = query.trim();
    if (!trimmed) {
      if (selectedType) {
        loadByType(selectedType, 0, false);
      } else {
        loadPage(0, false);
      }
      return;
    }

    const requestId = beginRequest();
    setInitialLoading(true);
    setError(null);
    try {
      const found = await fetchPokemonByName(trimmed);
      if (isStale(requestId)) return;
      setPokemon([found]);
      setNextOffset(null);
      setMode('search');
    } catch (err) {
      if (isStale(requestId)) return;
      setError(err.message);
      setPokemon([]);
    } finally {
      if (!isStale(requestId)) {
        setInitialLoading(false);
      }
    }
  }, [loadPage, loadByType, selectedType]);

  useEffect(() => {
    loadPage(0, false);
  }, [loadPage]);

  useEffect(() => {
    if (skipDebounce.current) {
      skipDebounce.current = false;
      return;
    }
    runSearch(debouncedSearch);
  }, [debouncedSearch, runSearch]);

  function handleTypeChange(type) {
    setSelectedType(type);
    skipDebounce.current = true;
    setSearch('');
    if (type) {
      loadByType(type, 0, false);
    } else {
      loadPage(0, false);
    }
  }

  async function handleRandom() {
    setError(null);
    setInitialLoading(true);
    try {
      const random = await fetchRandomPokemon();
      navigate(`/pokemon/${random.id}`);
    } catch (err) {
      setError(err.message);
      setInitialLoading(false);
    }
  }

  function handleLoadMore() {
    if (nextOffset === null) return;
    if (mode === 'type' && selectedType) {
      loadByType(selectedType, nextOffset, true);
    } else if (mode === 'browse') {
      loadPage(nextOffset, true);
    }
  }

  function handleRetry() {
    if (mode === 'search') runSearch(search);
    else if (mode === 'type' && selectedType) loadByType(selectedType, 0, false);
    else loadPage(0, false);
  }

  const showGrid = !initialLoading || pokemon.length > 0;
  const canLoadMore = mode !== 'search' && nextOffset !== null;

  return (
    <section className="page home">
      <div className="home__toolbar">
        <SearchBar value={search} onChange={setSearch} />
        <TypeFilter
          value={selectedType}
          onChange={handleTypeChange}
          disabled={initialLoading && !pokemon.length}
        />
        <button
          type="button"
          className="btn btn--secondary home__random"
          onClick={handleRandom}
          disabled={initialLoading && !pokemon.length}
        >
          Aleatório
        </button>
      </div>

      {initialLoading && !pokemon.length && <Loading />}

      {error && (
        <ErrorMessage message={error} onRetry={handleRetry} />
      )}

      {showGrid && (pokemon.length > 0 || !error) && (
        <>
          <PokemonGrid
            pokemon={pokemon}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
          {canLoadMore && (
            <div className="load-more">
              <button
                type="button"
                className="btn btn--primary"
                disabled={loadingMore}
                onClick={handleLoadMore}
              >
                {loadingMore ? 'Carregando...' : 'Carregar mais'}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
