export type SidebarItem = {
  label: string;
  href?: string;
  children?: SidebarItem[];
};

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/users" },
  { label: "Products", href: "/products" },
  {
    label: "Daily Tasks",
    children: [
      { label: "Day 1", href: "/day1" },
      { label: "Day 2", href: "/day2" },
      { label: "Day 3", href: "/day3" },
      { label: "Day 5", href: "/day5" },
      { label: "Day 6", href: "/day6" },
      { label: "Day 7", href: "/day7" },
      { label: "Day 8", href: "/day8" },
    ],
  },
  { label: "Testing", href: "/testing" },
];