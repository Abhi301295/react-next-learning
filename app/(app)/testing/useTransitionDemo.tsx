"use client";

import { Button } from "@/components/ui/Button";
import { useTransition, useState, type ComponentProps } from "react";

type Tab = "about" | "posts" | "contact";
type ButtonVariant = NonNullable<ComponentProps<typeof Button>["variant"]>;

export default function UseTransitionDemo() {
  const [tab, setTab] = useState<Tab>("about");
  const [isPending, startTransition] = useTransition();

  const selectTab = (next: Tab) => {
    startTransition(() => {
      setTab(next);
    });
  };

  return (
    <section className="space-y-3 rounded-lg border border-stroke bg-panel p-4">
      <h2 className="text-lg font-semibold">useTransition demo</h2>
      <p className="text-muted text-sm">
        The Posts tab is intentionally slow to render. With{" "}
        <code>useTransition</code>, the click stays responsive and{" "}
        <code>isPending</code> lets us show feedback.
      </p>

      <div className="flex flex-row items-center gap-2">
        <TabButton
          title="About"
          onClick={() => selectTab("about")}
          variant={tab === "about" ? "primary" : "secondary"}
        />
        <TabButton
          title="Posts"
          onClick={() => selectTab("posts")}
          variant={tab === "posts" ? "primary" : "secondary"}
        />
        <TabButton
          title="Contact"
          onClick={() => selectTab("contact")}
          variant={tab === "contact" ? "primary" : "secondary"}
        />
        {isPending && (
          <span className="text-muted text-sm">Loading…</span>
        )}
      </div>

      <div
        className={
          isPending ? "opacity-50 transition-opacity" : "transition-opacity"
        }
      >
        {tab === "about" && <AboutTab />}
        {tab === "posts" && <PostsTab />}
        {tab === "contact" && <ContactTab />}
      </div>
    </section>
  );
}

const AboutTab = () => <div>About</div>;

const ContactTab = () => <div>Contact</div>;

const PostsTab = () => (
  <ul className="list-disc pl-5">
    {Array.from({ length: 500 }, (_, i) => (
      <SlowPost key={i} index={i} />
    ))}
  </ul>
);

const SlowPost = ({ index }: { index: number }) => {
  const start = performance.now();
  while (performance.now() - start < 1) {
    // intentionally burn ~1ms per item so the tab switch is observably slow
  }
  return <li>Post #{index + 1}</li>;
};

const TabButton = ({
  title,
  onClick,
  variant,
}: {
  title: string;
  onClick: () => void;
  variant: ButtonVariant;
}) => (
  <Button type="button" variant={variant} size="sm" onClick={onClick}>
    {title}
  </Button>
);
