import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import TypeBadge, { getTypeColor } from '../components/badge';
import EvolutionChain from '../components/evolution';
import MegaEvolutions from '../components/megas';
import Loading from '../components/loading';
import ErrorMessage from '../components/error';
import {
  fetchPokemonByName,
  fetchEvolutionChain,
  fetchMegaEvolutions,
  formatAbilityName,
  formatDisplayName,
  formatMegaName,
  isMegaPokemon,
  getPokemonCount,
} from '../services/pokeApi';
import { useFavorites } from '../hooks/useFavorites';

export default function Detail() {
  const { id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [pokemon, setPokemon] = useState(null);
  const [evolution, setEvolution] = useState([]);
  const [megas, setMegas] = useState([]);
  const [maxId, setMaxId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showShiny, setShowShiny] = useState(false);

  useEffect(() => {
    getPokemonCount().then(setMaxId).catch(() => setMaxId(1025));
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      setShowShiny(false);
      try {
        const data = await fetchPokemonByName(id);
        if (cancelled) return;
        setPokemon(data);
        const [chain, megaForms] = await Promise.all([
          fetchEvolutionChain(data.speciesUrl),
          fetchMegaEvolutions(data.speciesUrl),
        ]);
        if (!cancelled) {
          setEvolution(chain);
          setMegas(megaForms);
        }
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <Loading />;
  if (error) {
    return (
      <section className="page detail">
        <ErrorMessage message={error} onRetry={() => window.location.reload()} />
        <Link to="/" className="back-link">
          ← Voltar
        </Link>
      </section>
    );
  }

  const favorite = isFavorite(pokemon.id);
  const heightM = (pokemon.height / 10).toFixed(1);
  const weightKg = (pokemon.weight / 10).toFixed(1);
  const primaryType = pokemon.types[0];
  const typeColor = getTypeColor(primaryType);
  const prevId = pokemon.id > 1 ? pokemon.id - 1 : null;
  const nextId = maxId && pokemon.id < maxId ? pokemon.id + 1 : null;
  const displayImage =
    showShiny && pokemon.shinyImage ? pokemon.shinyImage : pokemon.image;
  const hasShiny = Boolean(pokemon.shinyImage);
  const displayName = isMegaPokemon(pokemon.name)
    ? formatMegaName(pokemon.name)
    : formatDisplayName(pokemon.name);

  return (
    <section className="page detail">
      <div className="detail__nav-top">
        <Link to="/" className="back-link">
          ← Voltar
        </Link>
        <div className="detail__pager">
          {prevId ? (
            <Link to={`/pokemon/${prevId}`} className="detail__pager-link">
              ← #{String(prevId).padStart(3, '0')}
            </Link>
          ) : (
            <span className="detail__pager-link is-disabled">← ---</span>
          )}
          {nextId ? (
            <Link to={`/pokemon/${nextId}`} className="detail__pager-link">
              #{String(nextId).padStart(3, '0')} →
            </Link>
          ) : (
            <span className="detail__pager-link is-disabled">--- →</span>
          )}
        </div>
      </div>

      <article
        className="detail-card"
        style={{
          '--card-accent': typeColor,
          '--stat-color': typeColor,
          '--stat-color-light': typeColor,
        }}
      >
        <header className="detail-card__header">
          <div>
            <p className="detail-card__id">#{String(pokemon.id).padStart(3, '0')}</p>
            <h1 className="detail-card__name">{displayName}</h1>
            <div className="detail-card__types">
              {pokemon.types.map((type) => (
                <TypeBadge key={type} type={type} />
              ))}
            </div>
          </div>
          <div className="detail-card__actions">
            {hasShiny && (
              <button
                type="button"
                className={`btn btn--shiny ${showShiny ? 'is-active' : ''}`}
                onClick={() => setShowShiny((v) => !v)}
                aria-pressed={showShiny}
              >
                {showShiny ? 'Normal' : 'Shiny'}
              </button>
            )}
            <button
              type="button"
              className={`btn btn--favorite ${favorite ? 'is-active' : ''}`}
              onClick={() => toggleFavorite(pokemon)}
              aria-pressed={favorite}
            >
              {favorite ? 'Salvo' : 'Salvar'}
            </button>
          </div>
        </header>

        {displayImage && (
          <div className={`detail-card__image-wrap ${showShiny ? 'is-shiny' : ''}`}>
            <img src={displayImage} alt={pokemon.name} className="detail-card__image" />
          </div>
        )}

        <div className="detail-card__body">
          <dl className="detail-meta">
            <div>
              <dt>Altura</dt>
              <dd>{heightM} m</dd>
            </div>
            <div>
              <dt>Peso</dt>
              <dd>{weightKg} kg</dd>
            </div>
            {pokemon.baseExperience != null && (
              <div>
                <dt>Exp.</dt>
                <dd>{pokemon.baseExperience}</dd>
              </div>
            )}
          </dl>

          {pokemon.abilities.length > 0 && (
            <section className="detail-abilities">
              <h2>Habilidades</h2>
              <ul className="abilities-list">
                {pokemon.abilities.map((ability) => (
                  <li key={ability.name} className="ability-item">
                    <span className="ability-item__name">
                      {formatAbilityName(ability.name)}
                    </span>
                    {ability.isHidden && (
                      <span className="ability-item__hidden">oculta</span>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section className="detail-stats">
            <h2>Estatísticas</h2>
            <ul className="stats-list">
              {pokemon.stats.map((stat) => {
                const max = 255;
                const pct = Math.min(100, Math.round((stat.value / max) * 100));
                return (
                  <li key={stat.name} className="stat-row">
                    <span className="stat-row__name">{stat.name.replace('-', ' ')}</span>
                    <div className="stat-row__bar" aria-hidden="true">
                      <span style={{ width: `${pct}%` }} />
                    </div>
                    <span className="stat-row__value">{stat.value}</span>
                  </li>
                );
              })}
            </ul>
          </section>

          <EvolutionChain chain={evolution} currentId={pokemon.id} />
          <MegaEvolutions megas={megas} currentId={pokemon.id} />
        </div>
      </article>
    </section>
  );
}
