import { NavLink } from 'react-router-dom';
import { useFavorites } from '../hooks/useFavorites';

export default function Header() {
  const { favorites } = useFavorites();
  const count = favorites.length;

  return (
    <header className="header">
      <div className="header__inner">
        <NavLink to="/" className="header__brand">
          <img
            src={`${import.meta.env.BASE_URL}pokeball.svg`}
            alt=""
            className="header__logo"
            aria-hidden="true"
          />
          Pokédex
        </NavLink>
        <nav className="header__nav" aria-label="Principal">
          <NavLink to="/" className="header__link" end>
            Início
          </NavLink>
          <NavLink to="/favorites" className="header__link">
            Favoritos
            {count > 0 && (
              <span className="header__badge" aria-label={`${count} favoritos`}>
                {count}
              </span>
            )}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
