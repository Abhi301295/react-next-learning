import { useState } from "react";
import { validateEmail, validatePassword } from "../validation";

type FormState = {
    email: string;
    password: string;
};

type FormField = keyof FormState;

type ErrorState = Record<FormField, string>;

export const useLoginForm = () => {
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<FormState>({
        email: '',
        password: '',
    });

    const [errors, setErrors] = useState<ErrorState>({
        email: '',
        password: '',
    });

    const [submitted, setSubmitted] = useState(false);

    const validators: Record<FormField, (value: string) => string> = {
        email: validateEmail,
        password: validatePassword,
    };

    const validateField = (field: FormField, value: string) => {
        return validators[field](value);
    };

    const handleChange = (field: FormField, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const validateForm = () => {
        const newErrors: ErrorState = {
            email: validateField('email', form.email),
            password: validateField('password', form.password),
        };

        setErrors(newErrors);

        return !newErrors.email && !newErrors.password;
    };


    const handleBlur = (field: FormField, value: string) => {
        setErrors((prev) => ({
            ...prev,
            [field]: validateField(field, value),
        }));
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitted(true);

        if (!validateForm()) return;

        try {
            setLoading(true);
            await new Promise((res) => setTimeout(res, 1000));

            console.log('Form Submitted:', form);
        } finally {
            setLoading(false);
        }

    };
    return {
        form,
        errors,
        submitted,
        loading,
        handleChange,
        handleBlur,
        handleSubmit,
    };
}