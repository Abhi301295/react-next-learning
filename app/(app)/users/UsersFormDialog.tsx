"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/shared/modal/Modal";
import UserForm from "@/components/forms/UserForm";
import { Button } from "@/components/ui/Button";
import type { DummyJsonUserFormData } from "@/lib/validation/user.schema";
import {
  detailToFormDefaults,
  jsonRecordToFormDefaults,
  mapUpstreamUserJsonToUser,
} from "@/lib/users/json-to-user";
import type { UpstreamUserDetail } from "@/lib/users/types";
import type { User } from "@/lib/users/types";

const USER_MUTATE_DIALOG_FORM_ID = "user-mutate-dialog-form";

type UsersFormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  /** Edit started from the users table (fetch full record). */
  editUserId?: string | null;
  /** Edit started from profile page — skip fetch. */
  initialDetail?: UpstreamUserDetail | null;
  onSuccess?: (user: User, kind: "create" | "update") => void;
};

export default function UsersFormDialog({
  open,
  onOpenChange,
  mode,
  editUserId,
  initialDetail,
  onSuccess,
}: UsersFormDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [fetchedDefaults, setFetchedDefaults] = useState<
    Partial<DummyJsonUserFormData> | undefined
  >();

  const detailDefaults = useMemo(
    () =>
      mode === "edit" && initialDetail
        ? detailToFormDefaults(initialDetail)
        : undefined,
    [mode, initialDetail]
  );

  useEffect(() => {
    if (!open || mode !== "edit" || initialDetail || editUserId == null) {
      return;
    }
    let cancelled = false;
    const id = editUserId;
    void (async () => {
      try {
        const r = await fetch(`/api/users/${id}`, { credentials: "include" });
        const j = (await r.json()) as unknown;
        if (cancelled) return;
        if (!r.ok) {
          setServerError("Could not load user for editing.");
          setFetchedDefaults(undefined);
          return;
        }
        const d = jsonRecordToFormDefaults(j);
        setFetchedDefaults(d ?? undefined);
      } catch {
        if (!cancelled) setServerError("Could not load user for editing.");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, mode, editUserId, initialDetail]);

  const defaultsForForm =
    mode === "create" ? undefined : detailDefaults ?? fetchedDefaults;

  const title = mode === "create" ? "Add new user" : "Edit user";
  const formMountKey = useMemo(
    () =>
      `${mode}-${initialDetail?.id ?? editUserId ?? "new"}-${
        mode === "create" || !!defaultsForForm ? "ready" : "pend"
      }`,
    [mode, initialDetail?.id, editUserId, defaultsForForm]
  );

  const showUserForm = mode === "create" || !!defaultsForForm;

  const handleSubmit = useCallback(
    async (data: DummyJsonUserFormData) => {
      setServerError(null);
      try {
        const url =
          mode === "create"
            ? "/api/users"
            : `/api/users/${editUserId ?? initialDetail?.id}`;
        const res = await fetch(url, {
          method: mode === "create" ? "POST" : "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const payload = (await res.json().catch(() => null)) as unknown;
        if (!res.ok) {
          const msg =
            typeof payload === "object" &&
            payload !== null &&
            "message" in payload &&
            typeof (payload as { message: unknown }).message === "string"
              ? (payload as { message: string }).message
              : "Request failed.";
          setServerError(msg);
          return;
        }
        const user = mapUpstreamUserJsonToUser(payload, data.status);
        if (!user) {
          setServerError("Unexpected response from user service.");
          return;
        }
        onSuccess?.(user, mode === "create" ? "create" : "update");
        onOpenChange(false);
        if (initialDetail) {
          router.refresh();
        }
      } catch {
        setServerError("Something went wrong. Try again.");
      }
    },
    [mode, editUserId, initialDetail, onOpenChange, onSuccess, router]
  );

  return (
    <Modal
      isOpen={open}
      onClose={() => {
        setFormSubmitting(false);
        onOpenChange(false);
      }}
      title={title}
      panelClass="max-w-2xl"
      footer={
        showUserForm ? (
          <Button
            type="submit"
            form={USER_MUTATE_DIALOG_FORM_ID}
            className="w-full"
            disabled={formSubmitting}
          >
            {formSubmitting
              ? mode === "create"
                ? "Creating…"
                : "Saving…"
              : mode === "create"
                ? "Create user"
                : "Save changes"}
          </Button>
        ) : undefined
      }
    >
      <div className="space-y-4">
        {serverError && (
          <div
            role="alert"
            className="rounded border border-red-500 bg-red-50 p-3 text-sm text-red-700"
          >
            {serverError}
          </div>
        )}
        {mode === "edit" && !defaultsForForm && !serverError && (
          <p className="text-sm text-subtle">Loading user…</p>
        )}
        {showUserForm && (
          <UserForm
            key={formMountKey}
            defaultValues={
              mode === "create" ? undefined : defaultsForForm ?? undefined
            }
            submitLabel={mode === "create" ? "Create user" : "Save changes"}
            submittingLabel={
              mode === "create" ? "Creating…" : "Saving…"
            }
            onSubmit={handleSubmit}
            submitPlacement="footer"
            formId={USER_MUTATE_DIALOG_FORM_ID}
            onSubmittingChange={setFormSubmitting}
          />
        )}
      </div>
    </Modal>
  );
}
