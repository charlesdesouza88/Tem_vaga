import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-semibold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-300 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "bg-primary-700 text-white hover:bg-primary-800 shadow-md hover:shadow-lg active:scale-95",
                destructive:
                    "bg-red-600 text-white hover:bg-red-700 shadow-md hover:shadow-lg active:scale-95",
                outline:
                    "border-2 border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-50 hover:border-primary-500 hover:text-primary-700 shadow-sm hover:shadow-md",
                secondary:
                    "bg-neutral-100 text-neutral-800 hover:bg-neutral-200 border-2 border-neutral-200 hover:border-neutral-300",
                ghost: "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900 border border-transparent hover:border-neutral-200",
                link: "text-primary-600 hover:text-primary-700 underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }
