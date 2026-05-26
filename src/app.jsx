import { Routes, Route } from 'react-router-dom';
import Header from './components/header';
import Home from './pages/home';
import Detail from './pages/detail';
import Favorites from './pages/favorites';
import NotFound from './pages/notfound';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main className="app__main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pokemon/:id" element={<Detail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="app__footer">
        <p>
          Feito por{' '}
          <a href="https://github.com/ArthurCruzz17" target="_blank" rel="noreferrer">
            Arthur Cruz
          </a>
          {' · '}
          Dados via{' '}
          <a href="https://pokeapi.co/" target="_blank" rel="noreferrer">
            PokeAPI
          </a>
        </p>
      </footer>
    </div>
  );
}
