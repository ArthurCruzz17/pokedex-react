import PokemonCard from './card';

export default function PokemonGrid({ pokemon, isFavorite, onToggleFavorite }) {
  if (!pokemon?.length) {
    return <p className="empty-state">Nenhum Pokémon para exibir.</p>;
  }

  return (
    <ul className="pokemon-grid">
      {pokemon.map((p) => (
        <li key={p.id}>
          <PokemonCard
            pokemon={p}
            isFavorite={isFavorite(p.id)}
            onToggleFavorite={onToggleFavorite}
          />
        </li>
      ))}
    </ul>
  );
}
