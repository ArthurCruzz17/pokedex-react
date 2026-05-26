import { Link } from 'react-router-dom';
import PokemonGrid from '../components/grid';
import { useFavorites } from '../hooks/useFavorites';

export default function Favorites() {
  const { favorites, isFavorite, toggleFavorite } = useFavorites();

  return (
    <section className="page favorites">
      <h1 className="page__title">Favoritos</h1>
      {favorites.length === 0 ? (
        <p className="empty-state">
          Nada por aqui. <Link to="/">Ver todos</Link>
        </p>
      ) : (
        <>
          <p className="favorites-count">{favorites.length} salvo(s)</p>
          <PokemonGrid
            pokemon={favorites}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        </>
      )}
    </section>
  );
}
