'use client';
import { Button } from "../ui/Button";
import { Controller, useForm } from "react-hook-form";
import FormField from "../ui/FormField";
import Input from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "@/lib/validation/user.schema";
import Dropdown from "../shared/dropdown/Dropdown";
import DropdownOption from "../shared/dropdown/DropdownOption";

export default function AddUserForm() {
    const {
        register,
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<UserFormData>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            status: "active",
            role: "user",
        },
    });
    const onSubmit = async (data: UserFormData) => {
        console.log("User Data:", data);
    };
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormField label="Name" error={errors.name?.message}>
                <Input {...register("name")} placeholder="Enter name" />
            </FormField>

            <FormField label="Email" error={errors.email?.message}>
                <Input {...register("email")} placeholder="Enter email" />
            </FormField>

            <FormField label="Phone" error={errors.phone?.message}>
                <Input {...register("phone")} placeholder="Enter phone number" />
            </FormField>

            <FormField label="Role" error={errors.role?.message}>
                <Controller
                    name="role"
                    control={control}
                    render={({ field }) => (
                        <Dropdown
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Select role"
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
                            placeholder="Select status"
                        >
                            <DropdownOption value="active">Active</DropdownOption>
                            <DropdownOption value="inactive">Inactive</DropdownOption>
                        </Dropdown>
                    )}
                />
            </FormField>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating user..." : "Create User"}
            </Button>
        </form>
    );
}