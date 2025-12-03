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
                "relative inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300",
                // Sizes
                size === "sm" && "px-4 py-2 text-sm rounded-clay-sm",
                size === "md" && "px-6 py-3 text-base rounded-clay-md",
                size === "lg" && "px-8 py-4 text-lg rounded-clay-lg",
                // Variants
                variant === "primary" && "bg-primary-700 text-white shadow-lg hover:bg-primary-800 hover:shadow-xl",
                variant === "secondary" && "bg-white text-neutral-800 border-2 border-neutral-300 shadow-md hover:bg-neutral-50 hover:border-neutral-400 hover:shadow-lg",
                variant === "danger" && "bg-red-600 text-white shadow-lg hover:bg-red-700 hover:shadow-xl",
                variant === "ghost" && "bg-transparent text-neutral-700 border border-transparent hover:bg-neutral-100 hover:border-neutral-200 shadow-none",
                className
            )}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </button>
    )
}
