import { Link } from 'react-router-dom';
import TypeBadge, { getTypeColor } from './badge';
import { formatMegaName } from '../services/pokeApi';

export default function MegaEvolutions({ megas, currentId }) {
  if (!megas?.length) return null;

  return (
    <section className="mega-evolutions">
      <h2>Megas</h2>
      <ul className="mega-evolutions__list">
        {megas.map((pokemon) => (
          <li key={pokemon.id}>
            <Link
              to={`/pokemon/${pokemon.id}`}
              className={`mega-evolutions__card ${pokemon.id === currentId ? 'is-current' : ''}`}
              style={{ '--card-accent': getTypeColor(pokemon.types[0]) }}
            >
              {pokemon.image && (
                <img
                  src={pokemon.image}
                  alt={formatMegaName(pokemon.name)}
                  className="mega-evolutions__image"
                />
              )}
              <span className="mega-evolutions__name">{formatMegaName(pokemon.name)}</span>
              <div className="mega-evolutions__types">
                {pokemon.types.map((type) => (
                  <TypeBadge key={type} type={type} />
                ))}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
