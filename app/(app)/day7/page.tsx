import Day7Client from './Day7Client';
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: 'Day 7 - Table Features',
  description:
    'Reusable table features: search, filtering, pagination, selection, bulk actions, and row actions.',
  alternates: {
    canonical: "/day7",
  },
};

export default function Day7Page() {
  return <Day7Client />;
}
