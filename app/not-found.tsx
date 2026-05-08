export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-3 px-4 text-center">
      <h1 className="text-display-sm font-semibold text-brand-600">Page Not Found</h1>
      <p className="text-subtle">
        The page you are looking for does not exist or may have moved.
      </p>
    </main>
  );
}
