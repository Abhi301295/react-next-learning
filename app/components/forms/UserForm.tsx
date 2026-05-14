"use client";

import { useEffect, useMemo, useRef } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { messages } from "@/lib/constants/messages";
import {
  userProfileFormSchema,
  defaultUserProfileFormInput,
  USER_PHONE_DIGIT_MAX,
  type UserProfileFormInput,
} from "@/lib/validation/user.schema";
import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Dropdown from "@/components/shared/dropdown/Dropdown";
import DropdownOption from "@/components/shared/dropdown/DropdownOption";

type UserFormProps = {
  defaultValues?: Partial<UserProfileFormInput>;
  submitLabel: string;
  submittingLabel: string;
  onSubmit: (data: UserProfileFormInput) => Promise<void>;
  /** When `footer`, omit the inline submit button; use a sibling `button form={formId}`. */
  submitPlacement?: "inline" | "footer";
  /** Required when `submitPlacement` is `footer`. */
  formId?: string;
  onSubmittingChange?: (isSubmitting: boolean) => void;
};

function normalizePhoneDigits(value: unknown): string {
  if (typeof value !== "string" || value === "") return "";
  return value.replace(/\D/g, "").slice(0, USER_PHONE_DIGIT_MAX);
}

export default function UserForm({
  defaultValues,
  submitLabel,
  submittingLabel,
  onSubmit,
  submitPlacement = "inline",
  formId,
  onSubmittingChange,
}: UserFormProps) {
  const errorRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const mergedDefaultValues = useMemo(() => {
    const merged: UserProfileFormInput = {
      ...defaultUserProfileFormInput,
      ...defaultValues,
    };
    merged.phone = normalizePhoneDigits(
      defaultValues?.phone ?? defaultUserProfileFormInput.phone
    );
    return merged;
  }, [defaultValues]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserProfileFormInput>({
    resolver: zodResolver(userProfileFormSchema),
    defaultValues: mergedDefaultValues,
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorRef.current?.focus();
      const el = formRef.current?.querySelector("[aria-invalid='true']");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLElement | null)?.focus?.();
    }
  }, [errors]);

  useEffect(() => {
    if (submitPlacement !== "footer") return;
    onSubmittingChange?.(isSubmitting);
  }, [isSubmitting, onSubmittingChange, submitPlacement]);

  return (
    <form
      ref={formRef}
      id={submitPlacement === "footer" ? formId : undefined}
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
      })}
      className="space-y-5"
      noValidate
    >
      {Object.keys(errors).length > 0 && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="rounded border border-red-500 bg-red-50 p-3 text-sm text-red-700"
        >
          {messages.users.formFixErrors}
        </div>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Identity</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="First name" htmlFor="uf-firstName">
            <Input
              id="uf-firstName"
              autoComplete="given-name"
              error={errors.firstName?.message}
              {...register("firstName")}
            />
          </FormField>
          <FormField label="Last name" htmlFor="uf-lastName">
            <Input
              id="uf-lastName"
              autoComplete="family-name"
              error={errors.lastName?.message}
              {...register("lastName")}
            />
          </FormField>
        </div>
        <FormField label="Username" htmlFor="uf-username">
          <Input
            id="uf-username"
            autoComplete="username"
            error={errors.username?.message}
            {...register("username")}
          />
        </FormField>
        <FormField label="Email" htmlFor="uf-email">
          <Input
            id="uf-email"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
        </FormField>
        <FormField
          label="Phone"
          htmlFor="uf-phone"
          helperText="Optional. Numbers only, 8–15 digits (include country code if needed)."
        >
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                id="uf-phone"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="tel-national"
                placeholder="15551234567"
                maxLength={USER_PHONE_DIGIT_MAX}
                error={errors.phone?.message}
                name={field.name}
                ref={field.ref}
                value={
                  typeof field.value === "string" ? field.value : ""
                }
                onBlur={field.onBlur}
                onChange={(e) => {
                  const digits = e.target.value
                    .replace(/\D/g, "")
                    .slice(0, USER_PHONE_DIGIT_MAX);
                  field.onChange(digits);
                }}
              />
            )}
          />
        </FormField>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Age" htmlFor="uf-age">
            <Input
              id="uf-age"
              inputMode="numeric"
              error={errors.age?.message as string | undefined}
              {...register("age")}
            />
          </FormField>
          <FormField label="Gender">
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <Dropdown
                  value={String(field.value ?? "")}
                  onChange={field.onChange}
                  aria-label="Gender"
                  ariaInvalid={!!errors.gender}
                >
                  <DropdownOption value="">Not specified</DropdownOption>
                  <DropdownOption value="male">Male</DropdownOption>
                  <DropdownOption value="female">Female</DropdownOption>
                  <DropdownOption value="other">Other</DropdownOption>
                </Dropdown>
              )}
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Access</h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="Role">
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Dropdown
                  value={String(field.value ?? "user")}
                  onChange={field.onChange}
                  aria-label="Role"
                  ariaInvalid={!!errors.role}
                >
                  <DropdownOption value="user">User</DropdownOption>
                  <DropdownOption value="admin">Admin</DropdownOption>
                </Dropdown>
              )}
            />
          </FormField>
          <FormField label="Status (listing)">
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Dropdown
                  value={String(field.value ?? "active")}
                  onChange={field.onChange}
                  aria-label="Status"
                  ariaInvalid={!!errors.status}
                >
                  <DropdownOption value="active">Active</DropdownOption>
                  <DropdownOption value="inactive">Inactive</DropdownOption>
                </Dropdown>
              )}
            />
          </FormField>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-foreground">Address</h3>
        <FormField label="Street" htmlFor="uf-street">
          <Input
            id="uf-street"
            error={errors.address?.street?.message}
            {...register("address.street")}
          />
        </FormField>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FormField label="City" htmlFor="uf-city">
            <Input
              id="uf-city"
              error={errors.address?.city?.message}
              {...register("address.city")}
            />
          </FormField>
          <FormField label="State" htmlFor="uf-state">
            <Input
              id="uf-state"
              error={errors.address?.state?.message}
              {...register("address.state")}
            />
          </FormField>
          <FormField
            label="Postal code"
            htmlFor="uf-zip"
            helperText="Letters, numbers, one space or hyphen between groups (3–16 characters)."
          >
            <Input
              id="uf-zip"
              inputMode="text"
              autoComplete="postal-code"
              spellCheck={false}
              placeholder="e.g. 110001 or SW1A 1AA"
              maxLength={16}
              error={errors.address?.zip?.message}
              {...register("address.zip")}
            />
          </FormField>
          <FormField label="Country" htmlFor="uf-country">
            <Input
              id="uf-country"
              error={errors.address?.country?.message}
              {...register("address.country")}
            />
          </FormField>
        </div>
      </section>

      <FormField label="Profile image URL" htmlFor="uf-image">
        <Input
          id="uf-image"
          type="url"
          error={errors.image?.message}
          {...register("image")}
        />
      </FormField>

      {submitPlacement === "inline" && (
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? submittingLabel : submitLabel}
        </Button>
      )}
    </form>
  );
}
