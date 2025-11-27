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
                    "w-full px-4 py-3 bg-neutral-50 rounded-clay-md border-none shadow-clay-inset focus:ring-2 focus:ring-primary-300 focus:outline-none transition-all placeholder:text-neutral-400",
                    error && "ring-2 ring-red-300 bg-red-50",
                    className
                )}
                {...props}
            />
            {error && <p className="text-sm text-red-500 ml-1">{error}</p>}
        </div>
    )
}
