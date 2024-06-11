'use client';
// InputField.tsx
import React from "react";

interface InputFieldProps {
    id: string;
    label: string;
    placeholder: string;
    onChange: (value: string) => void; 
}

const InputField = ({ id, label, placeholder, onChange }: InputFieldProps) => {
    return (
        <div className="mt-5">
            <label htmlFor={id} className="mb-1 block">{label}</label>
            <input
                id={id}
                type="text"
                placeholder={placeholder}
                className="bg-white border border-gray-300 text-gray-900 text-sm rounded-sm focus:border-blue-500 w-full p-2.5"
                onChange={(e) => onChange(e.target.value)} 
            />
        </div>
    );
};

export default InputField;
