import Day2Client from "./Day2Client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Day 2 - Props and State",
  description: "Counters, tabs, modal, dropdown, and interactive UI state handling.",
  alternates: {
    canonical: "/day2",
  },
};

const Day2 = () => {
  return <Day2Client />;
};

export default Day2;