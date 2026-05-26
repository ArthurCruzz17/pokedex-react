import { POKEMON_TYPES, TYPE_LABELS } from '../constants/pokemonTypes';

export default function TypeFilter({ value, onChange, disabled }) {
  return (
    <div className="type-filter">
      <label className="visually-hidden" htmlFor="type-filter">
        Filtrar por tipo
      </label>
      <select
        id="type-filter"
        className="type-filter__select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label="Filtrar por tipo"
      >
        <option value="">Tipo</option>
        {POKEMON_TYPES.map((type) => (
          <option key={type} value={type}>
            {TYPE_LABELS[type]}
          </option>
        ))}
      </select>
    </div>
  );
}
