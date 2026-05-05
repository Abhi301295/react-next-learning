import Day1Client from "./Day1Client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Day 1 - Basic Components",
  description: "Reusable UI components: button, card, and layout basics.",
  alternates: {
    canonical: "/day1",
  },
};

const Day1 = () => {
  return <Day1Client />;
};

export default Day1;