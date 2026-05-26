export default function SearchBar({ value, onChange, placeholder }) {
  return (
    <form className="search-bar" role="search" onSubmit={(e) => e.preventDefault()}>
      <label className="visually-hidden" htmlFor="pokemon-search">
        Buscar Pokémon
      </label>
      <input
        id="pokemon-search"
        type="search"
        className="search-bar__input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || 'Nome ou número do pokémon'}
        autoComplete="off"
      />
    </form>
  );
}
