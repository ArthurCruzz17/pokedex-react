import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import TypeBadge, { getTypeColor } from '../components/badge';
import NotFound from '../pages/notfound';

describe('TypeBadge', () => {
  it('renderiza o nome do tipo', () => {
    render(<TypeBadge type="fire" />);
    expect(screen.getByText('fire')).toBeInTheDocument();
  });

  it('retorna cor conhecida para tipos válidos', () => {
    expect(getTypeColor('water')).toBe('#6890f0');
    expect(getTypeColor('unknown')).toBe('#888');
  });
});

describe('NotFound', () => {
  it('exibe mensagem de página não encontrada', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Página não encontrada' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /voltar/i })).toHaveAttribute('href', '/');
  });
});
