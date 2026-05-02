'use client';

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, UserFormData } from "@/lib/validation/user.schema";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Dropdown from "@/components/shared/dropdown/Dropdown";
import DropdownOption from "@/components/shared/dropdown/DropdownOption";

export default function AddUserForm() {
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
      address: {
        street: "",
        city: "",
        state: "",
        zip: "",
        country: "",
      },
    },
  });

  const onSubmit = async (data: UserFormData) => {
    console.log("User Data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Basic Information</h3>

        <FormField label="Name" error={errors.name?.message}>
          <Input {...register("name")} placeholder="Enter full name" />
        </FormField>

        <FormField label="Email" error={errors.email?.message}>
          <Input {...register("email")} placeholder="Enter email" />
        </FormField>

        <FormField label="Phone" error={errors.phone?.message}>
          <Input {...register("phone")} placeholder="Enter phone number" />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">User Settings</h3>

        <FormField label="Role" error={errors.role?.message}>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Dropdown value={field.value} onChange={field.onChange}>
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
              <Dropdown value={field.value} onChange={field.onChange}>
                <DropdownOption value="active">Active</DropdownOption>
                <DropdownOption value="inactive">Inactive</DropdownOption>
              </Dropdown>
            )}
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Address</h3>

        <FormField label="Street" error={errors.address?.street?.message}>
          <Input {...register("address.street")} placeholder="Street address" />
        </FormField>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="City" error={errors.address?.city?.message}>
            <Input {...register("address.city")} />
          </FormField>

          <FormField label="State" error={errors.address?.state?.message}>
            <Input {...register("address.state")} />
          </FormField>

          <FormField label="ZIP Code" error={errors.address?.zip?.message}>
            <Input {...register("address.zip")} />
          </FormField>

          <FormField label="Country" error={errors.address?.country?.message}>
            <Input {...register("address.country")} />
          </FormField>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>

        <FormField label="Description" error={errors.description?.message}>
          <textarea
            {...register("description")}
            className="w-full border rounded-md px-3 py-2"
            placeholder="Short description..."
          />
        </FormField>

        <FormField label="Avatar URL" error={errors.avatar?.message}>
          <Input {...register("avatar")} placeholder="https://image-url.com" />
        </FormField>
      </div>

      {/* 🚀 Submit */}
      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Creating user..." : "Create User"}
      </Button>

    </form>
  );
}