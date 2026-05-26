export default function Loading({ message }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="loading__spinner" aria-hidden="true" />
      <p>{message || 'Carregando...'}</p>
    </div>
  );
}
