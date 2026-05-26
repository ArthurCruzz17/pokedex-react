export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="error-message" role="alert">
      <p>{message || 'Algo deu errado.'}</p>
      {onRetry && (
        <button type="button" className="btn btn--secondary" onClick={onRetry}>
          Tentar novamente
        </button>
      )}
    </div>
  );
}
