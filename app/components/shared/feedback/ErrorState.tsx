export function ErrorState({ message }: { message: string }) {
  return (
    <div className="text-center py-6 text-red-500">
      <p>{message}</p>
    </div>
  );
}