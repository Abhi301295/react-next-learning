import type { Metadata } from "next";
import dynamic from "next/dynamic";

const Day3Client = dynamic(() => import("./Day3Client"), {
  loading: () => (
    <div
      className="mx-auto max-w-3xl space-y-4 p-4"
      aria-busy="true"
      aria-label="Loading list demo"
    >
      <div className="h-8 w-48 max-w-full animate-pulse rounded bg-stroke" />
      <div className="h-10 w-full max-w-md animate-pulse rounded bg-stroke" />
      <div className="h-52 w-full animate-pulse rounded-lg bg-stroke" />
    </div>
  ),
});

export const metadata: Metadata = {
  title: "Day 3 - Lists and States",
  description: "List rendering with loading, error, empty state, and pagination.",
  alternates: {
    canonical: "/day3",
  },
};

const Day3 = () => {
  return <Day3Client />;
};

export default Day3;