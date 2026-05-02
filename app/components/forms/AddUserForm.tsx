'use client';

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, UserFormData } from "@/lib/validation/user.schema";

import FormField from "@/components/ui/FormField";
import Input from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import Dropdown from "@/components/shared/dropdown/Dropdown";
import DropdownOption from "@/components/shared/dropdown/DropdownOption";
import { cn } from "@/lib/utils";
import { useEffect } from "react";

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

    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            const el = document.querySelector("[aria-invalid='true']");
            el?.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    }, [errors]);
    const onSubmit = async (data: UserFormData) => {
        console.log("Final User Data:", data);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

            {/* 🧑 Basic Info */}
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

            {/* ⚙️ Role & Status */}
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

            {/* 🏠 Dynamic Addresses */}
            <div className="space-y-4">
                <h3 className="text-lg font-semibold">Addresses</h3>

                {fields.map((field, index) => {
                    const hasError = !!errors.addresses?.[index];
                    return (
                        <div key={field.id} className={cn(
                            "border rounded-md p-4 space-y-3",
                            hasError && "border-red-500 bg-red-50"
                        )}>

                            <div className="flex justify-between items-center">
                                <h4 className="font-medium">Address {index + 1}</h4>

                                {fields.length > 1 && (
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => remove(index)}
                                    >
                                        Remove
                                    </Button>
                                )}
                            </div>
                            {hasError && (
                                <p className="text-sm text-red-500">
                                    Please fix errors in this address
                                </p>
                            )}

                            <FormField error={errors.addresses?.[index]?.street?.message}>
                                <Input {...register(`addresses.${index}.street`)} placeholder="Street" />
                            </FormField>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <FormField error={errors.addresses?.[index]?.city?.message}>
                                    <Input {...register(`addresses.${index}.city`)} placeholder="City" />
                                </FormField>

                                <FormField error={errors.addresses?.[index]?.state?.message}>
                                    <Input {...register(`addresses.${index}.state`)} placeholder="State" />
                                </FormField>

                                <FormField error={errors.addresses?.[index]?.zip?.message}>
                                    <Input {...register(`addresses.${index}.zip`)} placeholder="ZIP Code" />
                                </FormField>

                                <FormField error={errors.addresses?.[index]?.country?.message}>
                                    <Input {...register(`addresses.${index}.country`)} placeholder="Country" />
                                </FormField>

                            </div>

                        </div>
                    )
                }
                )

                }

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
                    + Add Address
                </Button>
            </div>

            {/* 📝 Additional Info */}
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