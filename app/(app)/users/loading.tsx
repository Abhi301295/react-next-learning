import { LoadingState } from "@/components/shared/feedback/LoadingState";

export default function UsersLoading() {
  return (
    <section
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading users"
    >
      <header className="space-y-2">
        <div className="h-8 w-40 max-w-full animate-pulse rounded-md bg-stroke sm:h-9" />
        <div className="h-4 w-full max-w-lg animate-pulse rounded-md bg-stroke" />
      </header>
      <LoadingState rows={8} layout="table" />
    </section>
  );
}
