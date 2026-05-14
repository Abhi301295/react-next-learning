/** List row shape returned by `GET /api/users`. */
export type UserListDto = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  username?: string;
  status?: "active" | "inactive";
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  status: "active" | "inactive";
};

/** Full profile from `GET/PUT /api/users/:id`. */
export type UserProfileDto = {
  id: string;
  name: string;
  email: string;
  status?: "active" | "inactive";
  phone?: string;
  image?: string;
  website?: string;
  company?: { name?: string };
  firstName?: string;
  lastName?: string;
  username?: string;
  age?: number;
  gender?: string;
  role?: "admin" | "user";
  address?: {
    address?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    zip?: string;
    country?: string;
  };
};
