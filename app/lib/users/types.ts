export type UpstreamUserListItem = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  username?: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
};

export type UpstreamUserDetail = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  image?: string;
  website?: string;
  company?: { name?: string };
};
