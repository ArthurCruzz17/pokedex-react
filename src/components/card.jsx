import { Link } from 'react-router-dom';
import TypeBadge, { getTypeColor } from './badge';

export default function PokemonCard({ pokemon, isFavorite, onToggleFavorite }) {
  const formattedId = String(pokemon.id).padStart(3, '0');
  const primaryType = pokemon.types[0];

  function handleFavoriteClick(e) {
    e.preventDefault();
    e.stopPropagation();
    onToggleFavorite?.(pokemon);
  }

  return (
    <article
      className="pokemon-card"
      style={{ '--card-accent': getTypeColor(primaryType) }}
    >
      <Link to={`/pokemon/${pokemon.id}`} className="pokemon-card__link">
        <span className="pokemon-card__id">#{formattedId}</span>
        {pokemon.image ? (
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="pokemon-card__image"
            loading="lazy"
          />
        ) : (
          <div className="pokemon-card__placeholder">?</div>
        )}
        <h2 className="pokemon-card__name">{pokemon.name}</h2>
        <div className="pokemon-card__types">
          {pokemon.types.map((type) => (
            <TypeBadge key={type} type={type} />
          ))}
        </div>
      </Link>
      <button
        type="button"
        className={`pokemon-card__favorite ${isFavorite ? 'is-active' : ''}`}
        onClick={handleFavoriteClick}
        aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        aria-pressed={isFavorite}
      >
        {isFavorite ? '★' : '☆'}
      </button>
    </article>
  );
}
