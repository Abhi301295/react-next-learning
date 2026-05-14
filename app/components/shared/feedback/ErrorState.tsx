import { Button } from "@/components/ui/Button";
import { messages } from "@/lib/constants/messages";

export function ErrorState({
  message = messages.common.somethingWentWrong,
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
        <Button onClick={onRetry}>{messages.actions.retry}</Button>
      )}
    </div>
  );
}
