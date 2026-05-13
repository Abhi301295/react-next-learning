export type SidebarItem = {
  label: string;
  href?: string;
  children?: SidebarItem[];
};

export const sidebarItems: SidebarItem[] = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Users", href: "/users" },
];
