import * as React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium tracking-[0.2em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        outline:
          'border border-current bg-transparent hover:bg-white/10',
        solid: 'bg-primary text-primary-foreground hover:opacity-90',
      },
      size: {
        default: 'h-12 px-8 py-3',
        sm: 'h-9 px-4',
      },
    },
    defaultVariants: {
      variant: 'outline',
      size: 'default',
    },
  },
)

const Button = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  ),
)
Button.displayName = 'Button'

// eslint-disable-next-line react-refresh/only-export-components
export { Button, buttonVariants }
