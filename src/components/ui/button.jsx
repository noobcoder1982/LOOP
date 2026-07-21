import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "../../lib/utils"

const Button = React.forwardRef(({ className, variant = "default", size = "default", asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button"
  
  const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer"
  
  const variants = {
    default: "bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200",
    destructive: "bg-red-900 text-zinc-50 shadow-sm hover:bg-red-800",
    outline: "border border-zinc-800 bg-transparent text-zinc-100 shadow-sm hover:bg-zinc-900 hover:text-zinc-50",
    secondary: "bg-zinc-800 text-zinc-100 shadow-sm hover:bg-zinc-700",
    ghost: "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-50",
    link: "text-zinc-100 underline-offset-4 hover:underline",
  }

  const sizes = {
    default: "h-9 px-4 py-2",
    sm: "h-8 rounded-md px-3 text-xs",
    lg: "h-10 rounded-md px-8",
    icon: "h-9 w-9",
  }

  return (
    <Comp
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }
