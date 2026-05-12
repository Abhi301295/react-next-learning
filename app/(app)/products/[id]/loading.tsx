import { SkeletonPulse } from "@/components/shared/feedback/SkeletonPulse";

/** Mirrors `ProductDetail` layout; hero uses a static shell (no pulse) since catalog images load quickly. */
export default function ProductDetailLoading() {
  return (
    <article
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading product"
    >
      <header className="space-y-4">
        <SkeletonPulse className="h-9 w-full max-w-2xl sm:h-10" />
        <dl className="grid gap-4 text-sm sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="space-y-2">
              <SkeletonPulse className="h-3 w-20" />
              <SkeletonPulse className="h-4 w-24" />
            </div>
          ))}
        </dl>
      </header>

      <figure className="max-w-xl">
        <div
          className="aspect-video w-full rounded-card border border-stroke bg-panel"
          aria-hidden
        />
        <SkeletonPulse className="mt-2 h-3 w-56 max-w-full" />
      </figure>

      <section
        className="rounded-card border border-stroke bg-panel p-4"
        aria-hidden
      >
        <SkeletonPulse className="h-5 w-32" />
        <div className="mt-3 space-y-2">
          <SkeletonPulse className="h-3 w-full" />
          <SkeletonPulse className="h-3 w-full" />
          <SkeletonPulse className="h-3 w-[80%]" />
        </div>
      </section>
    </article>
  );
}
