import type { User, UserProfileDto } from "./types";
import type { UserProfileFormInput } from "@/lib/validation/user.schema";

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function parseId(data: Record<string, unknown>): string | null {
  const raw = data.id;
  if (typeof raw === "number" && Number.isFinite(raw))
    return String(Math.trunc(raw));
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return null;
}

/** Map API JSON to a table `User` (optional `status` for optimistic rows). */
export function mapJsonToListUser(
  data: unknown,
  status: "active" | "inactive"
): User | null {
  if (!isRecord(data)) return null;
  const id = parseId(data);
  if (id == null) return null;
  const fn = typeof data.firstName === "string" ? data.firstName : "";
  const ln = typeof data.lastName === "string" ? data.lastName : "";
  const un = typeof data.username === "string" ? data.username.trim() : "";
  const name = `${fn} ${ln}`.trim() || un || `User ${id}`;
  if (typeof data.email !== "string") return null;
  const roleRaw = typeof data.role === "string" ? data.role : "user";
  const role = roleRaw === "admin" ? "admin" : "user";
  return { id, name, email: data.email, role, status };
}

export function detailToFormDefaults(
  user: UserProfileDto
): UserProfileFormInput {
  const addr = user.address;
  const street = typeof addr?.address === "string" ? addr.address : "";
  const city = typeof addr?.city === "string" ? addr.city : "";
  const state = typeof addr?.state === "string" ? addr.state : "";
  const zip =
    typeof addr?.postalCode === "string"
      ? addr.postalCode
      : typeof addr?.zip === "string"
        ? addr.zip
        : "";
  const country = typeof addr?.country === "string" ? addr.country : "";

  const pad = (s: string, min: number, fb: string) =>
    s.trim().length >= min ? s.trim() : fb;

  const status =
    user.status === "active" || user.status === "inactive"
      ? user.status
      : "active";

  const nameParts = user.name.trim().split(/\s+/);
  return {
    firstName: user.firstName ?? nameParts[0] ?? "",
    lastName:
      user.lastName ??
      (nameParts.length > 1 ? nameParts.slice(1).join(" ").trim() : ""),
    username: user.username?.trim() || `user_${user.id}`,
    email: user.email,
    phone: user.phone ?? "",
    age: user.age,
    gender:
      user.gender === "male" ||
      user.gender === "female" ||
      user.gender === "other"
        ? user.gender
        : "",
    role: user.role === "admin" ? "admin" : "user",
    status,
    address: {
      street: pad(street, 3, "Unknown street"),
      city: pad(city, 2, "Unknown"),
      state: pad(state, 2, "NA"),
      zip: pad(zip, 3, "000"),
      country: pad(country, 2, "NA"),
    },
    image: user.image ?? "",
  };
}

export function jsonRecordToFormDefaults(
  data: unknown
): UserProfileFormInput | null {
  if (!isRecord(data)) return null;
  const id = parseId(data);
  if (id == null) return null;
  const fn = typeof data.firstName === "string" ? data.firstName : "";
  const ln = typeof data.lastName === "string" ? data.lastName : "";
  const username =
    (typeof data.username === "string" ? data.username : "").trim() ||
    `user_${id}`;
  const email = typeof data.email === "string" ? data.email : "";
  if (!email.trim()) return null;
  const phone = typeof data.phone === "string" ? data.phone : "";
  const age =
    typeof data.age === "number" && Number.isFinite(data.age)
      ? data.age
      : undefined;
  const g = data.gender;
  const gender = g === "male" || g === "female" || g === "other" ? g : "";
  const roleRaw = typeof data.role === "string" ? data.role : "user";
  const role = roleRaw === "admin" ? "admin" : "user";
  const statusRaw = data.status;
  const status =
    statusRaw === "active" || statusRaw === "inactive" ? statusRaw : "active";
  const addr = data.address;
  let street = "";
  let city = "";
  let state = "";
  let zip = "";
  let country = "";
  if (isRecord(addr)) {
    street = typeof addr.address === "string" ? addr.address : "";
    city = typeof addr.city === "string" ? addr.city : "";
    state = typeof addr.state === "string" ? addr.state : "";
    zip =
      typeof addr.postalCode === "string"
        ? addr.postalCode
        : typeof addr.zip === "string"
          ? addr.zip
          : "";
    country = typeof addr.country === "string" ? addr.country : "";
  }
  const pad = (s: string, min: number, fb: string) =>
    s.trim().length >= min ? s.trim() : fb;
  return {
    firstName: fn,
    lastName: ln,
    username,
    email,
    phone,
    age,
    gender,
    role,
    status,
    address: {
      street: pad(street, 3, "Unknown street"),
      city: pad(city, 2, "Unknown"),
      state: pad(state, 2, "NA"),
      zip: pad(zip, 3, "000"),
      country: pad(country, 2, "NA"),
    },
    image: typeof data.image === "string" ? data.image : "",
  };
}
