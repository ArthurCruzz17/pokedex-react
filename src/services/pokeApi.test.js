import { describe, it, expect } from 'vitest';
import {
  mapPokemon,
  formatAbilityName,
  normalizePokemonQuery,
  formatMegaName,
  formatDisplayName,
  isMegaPokemon,
} from '../services/pokeApi';

describe('mapPokemon', () => {
  it('mapeia dados da API para o formato do app', () => {
    const raw = {
      id: 25,
      name: 'pikachu',
      sprites: {
        front_default: 'https://example.com/sprite.png',
        front_shiny: 'https://example.com/shiny.png',
        other: {
          'official-artwork': {
            front_default: 'https://example.com/art.png',
            front_shiny: 'https://example.com/art-shiny.png',
          },
        },
      },
      types: [{ type: { name: 'electric' } }],
      height: 4,
      weight: 60,
      base_experience: 112,
      abilities: [
        { ability: { name: 'static' }, is_hidden: false },
        { ability: { name: 'lightning-rod' }, is_hidden: true },
      ],
      species: { url: 'https://pokeapi.co/api/v2/pokemon-species/25/' },
      stats: [{ stat: { name: 'speed' }, base_stat: 90 }],
    };

    const result = mapPokemon(raw);

    expect(result.id).toBe(25);
    expect(result.name).toBe('pikachu');
    expect(result.image).toBe('https://example.com/art.png');
    expect(result.shinyImage).toBe('https://example.com/art-shiny.png');
    expect(result.types).toEqual(['electric']);
    expect(result.baseExperience).toBe(112);
    expect(result.abilities).toEqual([
      { name: 'static', isHidden: false },
      { name: 'lightning-rod', isHidden: true },
    ]);
    expect(result.stats[0].value).toBe(90);
  });
});

describe('formatAbilityName', () => {
  it('substitui hífens por espaços', () => {
    expect(formatAbilityName('lightning-rod')).toBe('lightning rod');
  });
});

describe('normalizePokemonQuery', () => {
  it('normaliza IDs numéricos com # e zeros à esquerda', () => {
    expect(normalizePokemonQuery('25')).toBe('25');
    expect(normalizePokemonQuery('025')).toBe('25');
    expect(normalizePokemonQuery('#25')).toBe('25');
    expect(normalizePokemonQuery('#025')).toBe('25');
  });

  it('mantém nomes em minúsculas', () => {
    expect(normalizePokemonQuery('Pikachu')).toBe('pikachu');
  });
});

describe('formatMegaName', () => {
  it('formata megas com variantes X e Y', () => {
    expect(formatMegaName('charizard-mega-x')).toBe('Mega Charizard X');
    expect(formatMegaName('charizard-mega-y')).toBe('Mega Charizard Y');
    expect(formatMegaName('lucario-mega')).toBe('Mega Lucario');
  });
});

describe('isMegaPokemon', () => {
  it('identifica formas mega pelo nome', () => {
    expect(isMegaPokemon('charizard-mega-x')).toBe(true);
    expect(isMegaPokemon('charizard')).toBe(false);
  });
});

describe('formatDisplayName', () => {
  it('capitaliza nomes com hífen', () => {
    expect(formatDisplayName('mr-mime')).toBe('Mr Mime');
  });
});
