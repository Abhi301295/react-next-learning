import React from "react";

interface Props {
    label?: string;
    error?: string;
    children: React.ReactNode;
}

const FormField = ({ label, error, children }: Props) => {
    return (
        <div className="space-y-1">
            {label && (
                <label className="text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}

            {children}

            {error && (
                <p className="text-sm text-red-500">{error}</p>
            )}
        </div>
    );
};

export default FormField;