import React from "react"
import { cn } from "@/lib/utils"

interface ClayCardProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "hover" | "flat"
}

export function ClayCard({ className, variant = "default", ...props }: ClayCardProps) {
    return (
        <div
            className={cn(
                "bg-white rounded-clay-xl p-6 transition-all duration-300",
                variant === "default" && "shadow-clay-md",
                variant === "hover" && "shadow-clay-md hover:shadow-clay-lg hover:-translate-y-1",
                variant === "flat" && "border-2 border-neutral-100",
                className
            )}
            {...props}
        />
    )
}
