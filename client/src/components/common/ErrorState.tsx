interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ title = "Something went wrong", message = "Please try again later.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
        <span className="text-red-500 text-2xl">!</span>
      </div>
      <h3 className="heading-sm text-brand-cream mb-2">{title}</h3>
      <p className="text-brand-cream/50 max-w-md mb-6">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="btn-primary">
          Try Again
        </button>
      )}
    </div>
  );
}
