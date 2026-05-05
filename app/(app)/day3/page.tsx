import Day3Client from "./Day3Client";
import type { Metadata } from "next";

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