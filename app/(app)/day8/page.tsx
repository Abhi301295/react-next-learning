import type { Metadata } from "next";
import React from "react";
import Day8Client from "./Day8Client";

export const metadata: Metadata = {
  title: "Day 8 - React Hooks Practice",
  description: "Practice useEffect, useMemo, useCallback, and useRef with interactive examples.",
  alternates: {
    canonical: "/day8",
  },
};

const page = () => {
  return (
    <Day8Client />
  )
}

export default page