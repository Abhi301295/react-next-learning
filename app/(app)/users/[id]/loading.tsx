import { SkeletonPulse } from "@/components/shared/feedback/SkeletonPulse";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";

/** Mirrors `UserDetail`; portrait is a static shell (no pulse) since avatars load quickly. */
export default function UserDetailLoading() {
  return (
    <article
      className="space-y-4"
      aria-busy="true"
      aria-label="Loading user profile"
    >
      <h1 className="sr-only">Loading user profile</h1>
      <header className="space-y-1">
        <SkeletonPulse className="h-9 w-64 max-w-full sm:h-10" />
        <SkeletonPulse className="h-4 w-44" />
      </header>

      <div
        className="h-36 w-36 shrink-0 rounded-full border border-stroke bg-panel"
        aria-hidden
      />

      <Card className="border-stroke bg-panel">
        <CardHeader>
          <CardTitle as="h2">Contact</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <SkeletonPulse className="h-4 w-full" />
          <SkeletonPulse className="h-4 w-[80%]" />
          <SkeletonPulse className="h-4 w-2/3" />
        </CardContent>
      </Card>

      <SkeletonPulse className="h-4 w-36" />
    </article>
  );
}
