import React from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

interface ClayButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "danger" | "ghost"
    size?: "sm" | "md" | "lg"
    isLoading?: boolean
}

export function ClayButton({
    className,
    variant = "primary",
    size = "md",
    isLoading = false,
    children,
    disabled,
    ...props
}: ClayButtonProps) {
    return (
        <button
            disabled={disabled || isLoading}
            className={cn(
                "relative inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
                // Sizes
                size === "sm" && "px-4 py-2 text-sm rounded-clay-sm",
                size === "md" && "px-6 py-3 text-base rounded-clay-md",
                size === "lg" && "px-8 py-4 text-lg rounded-clay-lg",
                // Variants
                variant === "primary" && "bg-primary-500 text-white shadow-clay-md hover:bg-primary-600 hover:shadow-clay-lg",
                variant === "secondary" && "bg-white text-neutral-700 shadow-clay-md hover:bg-neutral-50 hover:shadow-clay-lg",
                variant === "danger" && "bg-red-500 text-white shadow-clay-md hover:bg-red-600 hover:shadow-clay-lg",
                variant === "ghost" && "bg-transparent text-neutral-600 hover:bg-neutral-100 shadow-none",
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
}
