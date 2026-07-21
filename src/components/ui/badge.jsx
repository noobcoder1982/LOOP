import * as React from "react"
import { cn } from "../../lib/utils"

function Badge({ className, variant = "default", ...props }) {
  const baseStyles = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2"
  
  const variants = {
    default: "border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-200",
    secondary: "border-transparent bg-zinc-800 text-zinc-100 hover:bg-zinc-700",
    destructive: "border-transparent bg-red-950 text-red-200 border-red-900",
    outline: "text-zinc-300 border-zinc-800 bg-transparent",
    success: "border-transparent bg-emerald-950 text-emerald-350 border-emerald-900",
    neutral: "border-transparent bg-zinc-900 text-zinc-400",
  }

  return (
    <div className={cn(baseStyles, variants[variant], className)} {...props} />
  )
}

export { Badge }
