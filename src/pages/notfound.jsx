import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <section className="page not-found">
      <h1>Página não encontrada</h1>
      <p>O endereço não existe.</p>
      <Link to="/" className="back-link back-link--plain">
        Voltar
      </Link>
    </section>
  );
}
