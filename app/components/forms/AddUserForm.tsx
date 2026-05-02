'use client';
import { Button } from "../ui/Button";
import { useForm } from "react-hook-form";
import FormField from "../ui/FormField";
import Input from "../ui/Input";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema, UserFormData } from "@/lib/validation/user.schema";

export default function AddUserForm() {
    const {
        register,
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
                <select
                    {...register("role")}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
            </FormField>

            <FormField label="Status" error={errors.status?.message}>
                <select
                    {...register("status")}
                    className="w-full border px-3 py-2 rounded"
                >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                </select>
            </FormField>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Creating user..." : "Create User"}
            </Button>
        </form>
    );
}