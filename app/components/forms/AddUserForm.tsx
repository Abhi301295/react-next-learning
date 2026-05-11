'use client';

import { useEffect, useRef } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, UserFormData } from "@/lib/validation/user.schema";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Dropdown from "@/components/shared/dropdown/Dropdown";
import DropdownOption from "@/components/shared/dropdown/DropdownOption";
import { cn } from "@/lib/utils";

export default function AddUserForm() {

  const errorRef = useRef<HTMLDivElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "user",
      status: "active",
      addresses: [
        {
          street: "",
          city: "",
          state: "",
          zip: "",
          country: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "addresses",
  });

  const onSubmit = handleSubmit(async () => {
    /* Persist / API call — use `getValues()` when wiring submit to API */
  });

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorRef.current?.focus();

      const el = formRef.current?.querySelector("[aria-invalid='true']");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
      (el as HTMLElement | null)?.focus?.();
    }
  }, [errors]);

  return (
    <form ref={formRef} onSubmit={onSubmit} className="space-y-6" noValidate>

      <h2 className="text-2xl font-bold">Add User Details</h2>

      {Object.keys(errors).length > 0 && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="alert"
          className="p-3 border border-red-500 bg-red-50 text-red-700 rounded"
        >
          Please fix the errors in the form before submitting.
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Basic Information</h2>

        <FormField label="Name" htmlFor="name">
          <Input id="name" error={errors.name?.message} {...register("name")} placeholder="Enter full name" />
        </FormField>

        <FormField label="Email" htmlFor="email">
          <Input id="email" error={errors.email?.message} {...register("email")} placeholder="Enter email" />
        </FormField>

        <FormField label="Phone" htmlFor="phone">
          <Input id="phone" error={errors.phone?.message} {...register("phone")} placeholder="Enter phone number" />
        </FormField>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">User Settings</h2>

        <FormField label="Role">
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <>
                <Dropdown
                  value={field.value}
                  onChange={field.onChange}
                  aria-label="Select user role"
                  ariaInvalid={!!errors.role}
                  ariaDescribedBy={errors.role ? "role-error" : undefined}
                >
                  <DropdownOption value="user">User</DropdownOption>
                  <DropdownOption value="admin">Admin</DropdownOption>
                </Dropdown>
                {errors.role?.message && (
                  <span id="role-error" className="text-sm text-red-700">
                    {errors.role.message}
                  </span>
                )}
              </>
            )}
          />
        </FormField>

        <FormField label="Status">
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <>
                <Dropdown
                  value={field.value}
                  onChange={field.onChange}
                  aria-label="Select user status"
                  ariaInvalid={!!errors.status}
                  ariaDescribedBy={errors.status ? "status-error" : undefined}
                >
                  <DropdownOption value="active">Active</DropdownOption>
                  <DropdownOption value="inactive">Inactive</DropdownOption>
                </Dropdown>
                {errors.status?.message && (
                  <span id="status-error" className="text-sm text-red-700">
                    {errors.status.message}
                  </span>
                )}
              </>
            )}
          />
        </FormField>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Addresses</h2>

        {fields.map((field, index) => {
          const hasError = !!errors.addresses?.[index];

          return (
            <fieldset
              key={field.id}
              className={cn(
                "border rounded-md p-4 space-y-3",
                hasError && "border-red-500 bg-red-50"
              )}
            >
              <legend className="font-medium px-1">
                Address {index + 1}
              </legend>

              {hasError && (
                <p className="text-sm text-red-700">
                  Please fix errors in this address
                </p>
              )}

              <FormField label="Street" htmlFor={`street-${index}`}>
                <Input
                  id={`street-${index}`}
                  error={errors.addresses?.[index]?.street?.message}
                  {...register(`addresses.${index}.street`)}
                  placeholder="Street"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormField label="City" htmlFor={`city-${index}`}>
                  <Input id={`city-${index}`} error={errors.addresses?.[index]?.city?.message} {...register(`addresses.${index}.city`)} placeholder="City" />
                </FormField>

                <FormField label="State" htmlFor={`state-${index}`}>
                  <Input id={`state-${index}`} error={errors.addresses?.[index]?.state?.message} {...register(`addresses.${index}.state`)} placeholder="State" />
                </FormField>

                <FormField label="ZIP" htmlFor={`zip-${index}`}>
                  <Input id={`zip-${index}`} error={errors.addresses?.[index]?.zip?.message} {...register(`addresses.${index}.zip`)} placeholder="ZIP Code" />
                </FormField>

                <FormField label="Country" htmlFor={`country-${index}`}>
                  <Input id={`country-${index}`} error={errors.addresses?.[index]?.country?.message} {...register(`addresses.${index}.country`)} placeholder="Country" />
                </FormField>

              </div>

              {fields.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => remove(index)}
                >
                  Remove Address
                </Button>
              )}
            </fieldset>
          );
        })}

        <Button
          type="button"
          variant="outline"
          onClick={() =>
            append({
              street: "",
              city: "",
              state: "",
              zip: "",
              country: "",
            })
          }
        >
          Add Another Address
        </Button>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">Additional Information</h2>

        <FormField label="Description" htmlFor="description">
          <textarea
            id="description"
            {...register("description")}
            aria-invalid={!!errors.description}
            aria-describedby={errors.description ? "description-error" : undefined}
            className="w-full rounded-md border border-border bg-surface px-3 py-2"
            placeholder="Short description..."
          />
          {errors.description?.message && (
            <span id="description-error" className="text-sm text-red-700">
              {errors.description.message}
            </span>
          )}
        </FormField>

        <FormField label="Avatar URL" htmlFor="avatar">
          <Input id="avatar" error={errors.avatar?.message} {...register("avatar")} placeholder="https://image-url.com" />
        </FormField>
      </section>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating user..." : "Create User"}
      </Button>

    </form>
  );
}