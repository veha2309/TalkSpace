'use client'

import { cn } from "@/lib/utils";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";

interface InputProps {
    id: string
    label: string;
    type?: string;
    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    errors?: FieldErrors;
    register?: UseFormRegister<FieldValues>
    onChange ?: (e : React.ChangeEvent<HTMLInputElement>) => void
    className ?: string
    value ?: string
}

const Input: React.FC<InputProps> = ({
    label,
    type,
    id,
    placeholder,
    disabled,
    required,
    errors,
    register,
    onChange,
    className,
    value
}) => {
    if (register) {
        return (
            <div className="space-y-2 w-full">
                <div className="text-xl font-[600]">
                    {label}
                </div>
                <input
                    {...register(id, { required })}
                    className={cn(
                        `border-none outline-none ring-2 px-3 py-3 text-base w-full`,
                        errors?.[id] ? `ring-red-400` : `focus:ring-gray-500`,
                        className
                    )}
                    value={value}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />
            </div>
        );
    }
    if(onChange){
        
    }
    return(
            <div className="space-y-2 w-full">
                <div className="text-xl font-[600]">
                    {label}
                </div>
                <input
                onChange={onChange}
                    className={cn(
                        `border-none outline-none ring-2 px-3 py-2 text-base w-full`,
                        errors?.[id] ? `ring-red-400` : `focus:ring-gray-500`
                    )}
                    type={type}
                    placeholder={placeholder}
                    required={required}
                    disabled={disabled}
                />
            </div>
    )

}

export default Input;