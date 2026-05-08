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

  const onSubmit = async (_data: UserFormData) => {
    /* Persist / API call would run here */
  };

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      errorRef.current?.focus();

      const el = document.querySelector("[aria-invalid='true']");
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [errors]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>

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

        <FormField label="Name" htmlFor="name" error={errors.name?.message}>
          <Input id="name" {...register("name")} placeholder="Enter full name" />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input id="email" {...register("email")} placeholder="Enter email" />
        </FormField>

        <FormField label="Phone" htmlFor="phone" error={errors.phone?.message}>
          <Input id="phone" {...register("phone")} placeholder="Enter phone number" />
        </FormField>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold">User Settings</h2>

        <FormField label="Role" error={errors.role?.message}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                onChange={field.onChange}
                aria-label="Select user role"
              >
                <DropdownOption value="user">User</DropdownOption>
                <DropdownOption value="admin">Admin</DropdownOption>
              </Dropdown>
            )}
          />
        </FormField>

        <FormField label="Status" error={errors.status?.message}>
          <Controller
            name="status"
            control={control}
            render={({ field }) => (
              <Dropdown
                value={field.value}
                onChange={field.onChange}
                aria-label="Select user status"
              >
                <DropdownOption value="active">Active</DropdownOption>
                <DropdownOption value="inactive">Inactive</DropdownOption>
              </Dropdown>
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
                <p className="text-sm text-red-500">
                  Please fix errors in this address
                </p>
              )}

              <FormField
                label="Street"
                htmlFor={`street-${index}`}
                error={errors.addresses?.[index]?.street?.message}
              >
                <Input
                  id={`street-${index}`}
                  {...register(`addresses.${index}.street`)}
                  placeholder="Street"
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <FormField label="City" htmlFor={`city-${index}`} error={errors.addresses?.[index]?.city?.message}>
                  <Input id={`city-${index}`} {...register(`addresses.${index}.city`)} placeholder="City" />
                </FormField>

                <FormField label="State" htmlFor={`state-${index}`} error={errors.addresses?.[index]?.state?.message}>
                  <Input id={`state-${index}`} {...register(`addresses.${index}.state`)} placeholder="State" />
                </FormField>

                <FormField label="ZIP" htmlFor={`zip-${index}`} error={errors.addresses?.[index]?.zip?.message}>
                  <Input id={`zip-${index}`} {...register(`addresses.${index}.zip`)} placeholder="ZIP Code" />
                </FormField>

                <FormField label="Country" htmlFor={`country-${index}`} error={errors.addresses?.[index]?.country?.message}>
                  <Input id={`country-${index}`} {...register(`addresses.${index}.country`)} placeholder="Country" />
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

        <FormField label="Description" htmlFor="description" error={errors.description?.message}>
          <textarea
            id="description"
            {...register("description")}
            className="w-full rounded-md border border-border bg-surface px-3 py-2"
            placeholder="Short description..."
          />
        </FormField>

        <FormField label="Avatar URL" htmlFor="avatar" error={errors.avatar?.message}>
          <Input id="avatar" {...register("avatar")} placeholder="https://image-url.com" />
        </FormField>
      </section>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating user..." : "Create User"}
      </Button>

    </form>
  );
}