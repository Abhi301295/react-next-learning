import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DocumentData, DocumentSnapshot } from "firebase-admin/firestore";
import { getAdminFirestore } from "@/lib/firebase/admin";
import { messages } from "@/lib/constants/messages";
import type { UserProfileFormValues } from "@/lib/validation/user.schema";
import type { UserListDto, UserProfileDto } from "./types";

/** Firestore collection id (legacy segment name; changing it requires a data migration). */
export const USERS_COLLECTION_ID = "directory_users";

const LIST_CAP = 500;

type AddressDoc = {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

export type UserRecord = {
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

export function parseUserRecordSnapshot(
  snap: DocumentSnapshot
): { id: string; data: UserRecord } | null {
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

export function formValuesToUserRecordFields(
  data: UserProfileFormValues
): Omit<UserRecord, "createdAt" | "updatedAt"> {
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

export function userRecordToListDto(id: string, d: UserRecord): UserListDto {
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

export function userRecordToProfileDto(id: string, d: UserRecord): UserProfileDto {
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

/** JSON body for API clients and `jsonRecordToFormDefaults`. */
export function userRecordToResponseJson(
  id: string,
  d: UserRecord
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

export async function listAllUserRecords(): Promise<
  { id: string; data: UserRecord }[]
> {
  const db = getAdminFirestore();
  const snap = await db.collection(USERS_COLLECTION_ID).limit(LIST_CAP).get();
  const out: { id: string; data: UserRecord }[] = [];
  for (const doc of snap.docs) {
    const parsed = parseUserRecordSnapshot(doc);
    if (parsed) out.push(parsed);
  }
  return out;
}

export async function getUserRecordById(
  id: string
): Promise<{ id: string; data: UserRecord } | null> {
  if (!id.trim()) return null;
  const db = getAdminFirestore();
  const snap = await db.collection(USERS_COLLECTION_ID).doc(id).get();
  return parseUserRecordSnapshot(snap);
}

export async function createUserRecord(
  data: UserProfileFormValues
): Promise<{ id: string; data: UserRecord }> {
  const db = getAdminFirestore();
  const fields = formValuesToUserRecordFields(data);
  const ref = db.collection(USERS_COLLECTION_ID).doc();
  const now = FieldValue.serverTimestamp();
  await ref.set({
    ...fields,
    createdAt: now,
    updatedAt: now,
  });
  const snap = await ref.get();
  const parsed = parseUserRecordSnapshot(snap);
  if (!parsed) {
    throw new Error(messages.users.repositoryReadCreated);
  }
  return parsed;
}

export async function updateUserRecord(
  id: string,
  data: UserProfileFormValues
): Promise<{ id: string; data: UserRecord } | null> {
  const db = getAdminFirestore();
  const ref = db.collection(USERS_COLLECTION_ID).doc(id);
  const existing = await ref.get();
  if (!existing.exists) return null;
  const fields = formValuesToUserRecordFields(data);
  await ref.set(
    {
      ...fields,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  const snap = await ref.get();
  return parseUserRecordSnapshot(snap);
}

export async function deleteUserRecord(id: string): Promise<boolean> {
  const db = getAdminFirestore();
  const ref = db.collection(USERS_COLLECTION_ID).doc(id);
  const snap = await ref.get();
  if (!snap.exists) return false;
  await ref.delete();
  return true;
}
