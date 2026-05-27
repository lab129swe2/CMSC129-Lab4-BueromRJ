type LoadErrorStateProps = {
  title: string;
  message: string;
  onRetry?: () => void;
};

export function LoadErrorState({ title, message, onRetry }: LoadErrorStateProps) {
  return (
    <div role="status" className="rounded-box border border-base-300 bg-base-100 p-6 text-center shadow-sm">
      <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="size-6" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" d="M9 5h6m-6 4h6m-6 4h3m-6 7h12a2 2 0 002-2V6l-4-4H6a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-semibold">{title}</h3>
      <p className="mt-1 text-sm text-base-content/70">{message}</p>
      {onRetry ? (
        <button type="button" className="btn btn-primary btn-sm mt-5" onClick={onRetry}>
          Try Again
        </button>
      ) : null}
    </div>
  );
}
