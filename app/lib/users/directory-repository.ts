import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase/admin";
import type { DummyJsonUserFormValues } from "@/lib/validation/user.schema";
import type { UpstreamUserDetail, UpstreamUserListItem } from "./types";

export const DIRECTORY_USERS_COLLECTION = "directory_users";

const LIST_CAP = 500;

type AddressDoc = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type DirectoryUserDoc = {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  age?: number;
  gender: string;
  role: "admin" | "user";
  status: "active" | "inactive";
  address: AddressDoc;
  image: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
};

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function asRole(v: unknown): "admin" | "user" {
  return v === "admin" ? "admin" : "user";
}

function asStatus(v: unknown): "active" | "inactive" {
  return v === "inactive" ? "inactive" : "active";
}

function parseAddress(raw: unknown): AddressDoc {
  if (typeof raw !== "object" || raw === null) {
    return {
      street: "",
      city: "",
      state: "",
      zip: "",
      country: "",
    };
  }
  const a = raw as Record<string, unknown>;
  return {
    street: asString(a.street),
    city: asString(a.city),
    state: asString(a.state),
    zip: asString(a.zip),
    country: asString(a.country),
  };
}

export function parseDirectoryDoc(
  snap: DocumentSnapshot
): { id: string; data: DirectoryUserDoc } | null {
  if (!snap.exists) return null;
  const d = snap.data() as DocumentData | undefined;
  if (!d) return null;
  const createdAt = d.createdAt instanceof Timestamp ? d.createdAt : Timestamp.now();
  const updatedAt = d.updatedAt instanceof Timestamp ? d.updatedAt : createdAt;
  return {
    id: snap.id,
    data: {
      firstName: asString(d.firstName),
      lastName: asString(d.lastName),
      username: asString(d.username),
      email: asString(d.email),
      phone: asString(d.phone),
      age: typeof d.age === "number" && Number.isFinite(d.age) ? d.age : undefined,
      gender: asString(d.gender),
      role: asRole(d.role),
      status: asStatus(d.status),
      address: parseAddress(d.address),
      image: asString(d.image),
      createdAt,
      updatedAt,
    },
  };
}

export function formValuesToDirectoryFields(
  data: DummyJsonUserFormValues
): Omit<DirectoryUserDoc, "createdAt" | "updatedAt"> {
  return {
    firstName: data.firstName.trim(),
    lastName: data.lastName.trim(),
    username: data.username.trim(),
    email: data.email.trim(),
    phone: (data.phone ?? "").trim(),
    age: data.age,
    gender: (data.gender ?? "").trim(),
    role: data.role,
    status: data.status,
    address: {
      street: data.address.street.trim(),
      city: data.address.city.trim(),
      state: data.address.state.trim(),
      zip: data.address.zip.trim(),
      country: data.address.country.trim(),
    },
    image: (data.image ?? "").trim(),
  };
}

export function directoryDocToListItem(
  id: string,
  d: DirectoryUserDoc
): UpstreamUserListItem {
  return {
    id,
    firstName: d.firstName,
    lastName: d.lastName,
    email: d.email,
    role: d.role,
    username: d.username,
    status: d.status,
  };
}

export function directoryDocToDetail(
  id: string,
  d: DirectoryUserDoc
): UpstreamUserDetail {
  const name =
    `${d.firstName} ${d.lastName}`.trim() ||
    d.username.trim() ||
    `User ${id}`;
  return {
    id,
    name,
    email: d.email,
    phone: d.phone || undefined,
    image: d.image || undefined,
    firstName: d.firstName,
    lastName: d.lastName,
    username: d.username,
    age: d.age,
    gender: d.gender || undefined,
    role: d.role,
    status: d.status,
    address: {
      address: d.address.street,
      city: d.address.city,
      state: d.address.state,
      postalCode: d.address.zip,
      country: d.address.country,
    },
  };
}

/** JSON record compatible with `jsonRecordToFormDefaults` / clients. */
export function directoryDocToPublicRecord(
  id: string,
  d: DirectoryUserDoc
): Record<string, unknown> {
  return {
    id,
    firstName: d.firstName,
    lastName: d.lastName,
    username: d.username,
    email: d.email,
    phone: d.phone,
    age: d.age,
    gender: d.gender,
    role: d.role,
    status: d.status,
    image: d.image,
    address: {
      address: d.address.street,
      city: d.address.city,
      state: d.address.state,
      postalCode: d.address.zip,
      country: d.address.country,
    },
  };
}

export async function listAllDirectoryUsers(): Promise<
  { id: string; data: DirectoryUserDoc }[]
> {
  const db = getAdminFirestore();
  const snap = await db.collection(DIRECTORY_USERS_COLLECTION).limit(LIST_CAP).get();
  const out: { id: string; data: DirectoryUserDoc }[] = [];
  for (const doc of snap.docs) {
    const parsed = parseDirectoryDoc(doc);
    if (parsed) out.push(parsed);
  }
  return out;
}

export async function getDirectoryUserById(
  id: string
): Promise<{ id: string; data: DirectoryUserDoc } | null> {
  if (!id.trim()) return null;
  const db = getAdminFirestore();
  const snap = await db.collection(DIRECTORY_USERS_COLLECTION).doc(id).get();
  return parseDirectoryDoc(snap);
}

export async function createDirectoryUser(
  data: DummyJsonUserFormValues
): Promise<{ id: string; data: DirectoryUserDoc }> {
  const db = getAdminFirestore();
  const fields = formValuesToDirectoryFields(data);
  const ref = db.collection(DIRECTORY_USERS_COLLECTION).doc();
  const now = FieldValue.serverTimestamp();
  await ref.set({
    ...fields,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await ref.get();
  const parsed = parseDirectoryDoc(snap);
  if (!parsed) {
    throw new Error("Failed to read created user.");
  }
  return parsed;
}

export async function updateDirectoryUser(
  id: string,
  data: DummyJsonUserFormValues
): Promise<{ id: string; data: DirectoryUserDoc } | null> {
  const db = getAdminFirestore();
  const ref = db.collection(DIRECTORY_USERS_COLLECTION).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  const fields = formValuesToDirectoryFields(data);
  await ref.set(
    {
      ...fields,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  const snap = await ref.get();
  return parseDirectoryDoc(snap);
}

export async function deleteDirectoryUser(id: string): Promise<boolean> {
  const db = getAdminFirestore();
  const ref = db.collection(DIRECTORY_USERS_COLLECTION).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}
