import { Button } from '@/components/ui/Button';

export function ErrorState({
  message = "Something went wrong",
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 text-center space-y-3"
      role="alert"
      aria-live="assertive"
    >
      <p className="font-medium text-red-600 dark:text-red-400">{message}</p>

      {onRetry && (
        <Button onClick={onRetry}>
          Retry
        </Button>
      )}
    </div>
  );
}