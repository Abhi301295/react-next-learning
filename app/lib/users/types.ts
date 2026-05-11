export type UpstreamUserListItem = {
  id: number;
  name: string;
  email: string;
};

/** One row in the users list UI (mapped from upstream; role/status derived from id). */
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
  website?: string;
  company?: { name?: string };
};
