const BASE_URL = 'https://pokeapi.co/api/v2';

let pokemonCountCache = null;

export function mapPokemon(data) {
  return {
    id: data.id,
    name: data.name,
    image:
      data.sprites?.other?.['official-artwork']?.front_default ||
      data.sprites?.front_default ||
      null,
    shinyImage:
      data.sprites?.other?.['official-artwork']?.front_shiny ||
      data.sprites?.front_shiny ||
      null,
    types: (data.types || []).map((t) => t.type.name),
    height: data.height,
    weight: data.weight,
    baseExperience: data.base_experience ?? null,
    abilities: (data.abilities || []).map((a) => ({
      name: a.ability.name,
      isHidden: a.is_hidden,
    })),
    speciesUrl: data.species?.url || null,
    stats: (data.stats || []).map((s) => ({
      name: s.stat.name,
      value: s.base_stat,
    })),
  };
}

export function formatAbilityName(name) {
  return name.replace(/-/g, ' ');
}

export function formatDisplayName(name) {
  return name
    .replace(/-mega-(x|y)$/i, '')
    .replace(/-mega$/i, '')
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function formatMegaName(name) {
  if (!name.includes('-mega')) return formatDisplayName(name);

  const match = name.match(/^(.+?)-mega(?:-([xy]))?$/i);
  if (!match) return formatDisplayName(name);

  const base = match[1]
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const variant = match[2] ? ` ${match[2].toUpperCase()}` : '';
  return `Mega ${base}${variant}`;
}

export function isMegaPokemon(name) {
  return name.includes('-mega');
}

export async function getPokemonCount() {
  if (pokemonCountCache !== null) return pokemonCountCache;
  const res = await fetch(`${BASE_URL}/pokemon?limit=1`);
  if (!res.ok) throw new Error('Não foi possível obter total de Pokémon.');
  const data = await res.json();
  pokemonCountCache = data.count;
  return data.count;
}

export async function fetchPokemonList(offset = 0, limit = 20) {
  const listRes = await fetch(`${BASE_URL}/pokemon?offset=${offset}&limit=${limit}`);
  if (!listRes.ok) {
    throw new Error('Não foi possível carregar a lista de Pokémon.');
  }
  const listData = await listRes.json();
  const details = await Promise.all(
    listData.results.map(async (item) => {
      const res = await fetch(item.url);
      if (!res.ok) throw new Error(`Erro ao carregar ${item.name}`);
      const data = await res.json();
      return mapPokemon(data);
    })
  );
  return {
    pokemon: details,
    total: listData.count,
    nextOffset: offset + limit < listData.count ? offset + limit : null,
  };
}

export function normalizePokemonQuery(nameOrId) {
  let query = String(nameOrId).trim().toLowerCase();
  if (!query) return '';
  query = query.replace(/^#+/, '');
  if (/^\d+$/.test(query)) {
    const numericId = parseInt(query, 10);
    if (!numericId) return '';
    query = String(numericId);
  }
  return query;
}

export async function fetchPokemonByName(nameOrId) {
  const query = normalizePokemonQuery(nameOrId);
  if (!query) {
    throw new Error('Informe o nome ou ID do Pokémon.');
  }
  const res = await fetch(`${BASE_URL}/pokemon/${encodeURIComponent(query)}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Pokémon não encontrado.');
    }
    throw new Error('Erro ao buscar Pokémon.');
  }
  const data = await res.json();
  return mapPokemon(data);
}

export async function fetchRandomPokemon() {
  const count = await getPokemonCount();
  const randomId = Math.floor(Math.random() * count) + 1;
  return fetchPokemonByName(randomId);
}

const typePokemonCache = new Map();

async function getTypePokemonNames(type) {
  if (typePokemonCache.has(type)) return typePokemonCache.get(type);
  const res = await fetch(`${BASE_URL}/type/${type}`);
  if (!res.ok) throw new Error(`Tipo "${type}" não encontrado.`);
  const data = await res.json();
  const names = data.pokemon.map((p) => p.pokemon.name);
  typePokemonCache.set(type, names);
  return names;
}

export async function fetchPokemonByType(type, offset = 0, limit = 20) {
  const names = await getTypePokemonNames(type);
  const slice = names.slice(offset, offset + limit);
  const details = await Promise.all(slice.map((name) => fetchPokemonByName(name)));
  return {
    pokemon: details,
    total: names.length,
    nextOffset: offset + limit < names.length ? offset + limit : null,
  };
}

function collectEvolutionNames(chainNode, result = []) {
  result.push(chainNode.species.name);
  chainNode.evolves_to.forEach((node) => collectEvolutionNames(node, result));
  return result;
}

export async function fetchEvolutionChain(speciesUrl) {
  if (!speciesUrl) return [];

  const speciesRes = await fetch(speciesUrl);
  if (!speciesRes.ok) return [];
  const speciesData = await speciesRes.json();

  const chainRes = await fetch(speciesData.evolution_chain.url);
  if (!chainRes.ok) return [];
  const chainData = await chainRes.json();

  const names = collectEvolutionNames(chainData.chain);
  const uniqueNames = [...new Set(names)];
  return Promise.all(uniqueNames.map((name) => fetchPokemonByName(name)));
}

export async function fetchMegaEvolutions(speciesUrl) {
  if (!speciesUrl) return [];

  const speciesRes = await fetch(speciesUrl);
  if (!speciesRes.ok) return [];
  const speciesData = await speciesRes.json();

  const megaNames = speciesData.varieties
    .map((variety) => variety.pokemon.name)
    .filter((name) => isMegaPokemon(name));

  if (megaNames.length === 0) return [];

  return Promise.all(megaNames.map((name) => fetchPokemonByName(name)));
}
