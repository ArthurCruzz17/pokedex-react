import { Link } from 'react-router-dom';
import { formatDisplayName } from '../services/pokeApi';
import { getTypeColor } from './badge';

export default function EvolutionChain({ chain, currentId }) {
  if (!chain?.length) return null;

  return (
    <section className="evolution-chain">
      <h2>Evolução</h2>
      <ol className="evolution-chain__list">
        {chain.map((pokemon, index) => (
          <li key={pokemon.id} className="evolution-chain__item">
            {index > 0 && <span className="evolution-chain__arrow" aria-hidden="true">→</span>}
            <Link
              to={`/pokemon/${pokemon.id}`}
              className={`evolution-chain__card ${pokemon.id === currentId ? 'is-current' : ''}`}
              style={{ '--card-accent': getTypeColor(pokemon.types[0]) }}
            >
              {pokemon.image && (
                <img src={pokemon.image} alt={pokemon.name} className="evolution-chain__image" />
              )}
              <span className="evolution-chain__name">{formatDisplayName(pokemon.name)}</span>
              <span className="evolution-chain__id">#{String(pokemon.id).padStart(3, '0')}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
