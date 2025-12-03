import React from "react"
import { cn } from "@/lib/utils"

interface ClayInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
}

export function ClayInput({ className, label, error, id, ...props }: ClayInputProps) {
    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={id} className="block text-sm font-semibold text-neutral-700 ml-1">
                    {label}
                </label>
            )}
            <input
                id={id}
                className={cn(
                    "w-full px-4 py-3 bg-white border-2 border-neutral-300 rounded-xl focus:border-primary-600 focus:ring-4 focus:ring-primary-300 focus:outline-none transition-all placeholder:text-neutral-400 text-neutral-900",
                    error && "border-red-400 ring-4 ring-red-200 bg-red-50",
                    className
                )}
                {...props}
            />
            {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
        </div>
    )
}
