import Day6Client from './Day6Client';
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Day 6 - API Table Integration",
    description: "View and manage users fetched from API with table presentation.",
    alternates: {
        canonical: "/day6",
    },
};
export default function Day6Page() {

    return (
        <Day6Client />
    );
}