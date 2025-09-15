"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

interface DropdownMenuProps {
  children: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function DropdownMenu({ children, open: controlledOpen, onOpenChange }: DropdownMenuProps) {
  const [internalOpen, setInternalOpen] = React.useState(false)
  const open = controlledOpen ?? internalOpen
  
  const handleOpenChange = (newOpen: boolean) => {
    if (onOpenChange) {
      onOpenChange(newOpen)
    } else {
      setInternalOpen(newOpen)
    }
  }

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          if (child.type === DropdownMenuTrigger) {
            return React.cloneElement(child, { 
              onClick: () => handleOpenChange(!open),
              'aria-expanded': open 
            } as any)
          }
          if (child.type === DropdownMenuContent && open) {
            return React.cloneElement(child, { 
              onClose: () => handleOpenChange(false) 
            } as any)
          }
          if (child.type === DropdownMenuContent && !open) {
            return null
          }
        }
        return child
      })}
    </div>
  )
}

interface DropdownMenuTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
}

export function DropdownMenuTrigger({ children, className, asChild, ...props }: DropdownMenuTriggerProps) {
  if (asChild && React.isValidElement(children)) {
    return React.cloneElement(children, { 
      ...props, 
      className: cn(children.props.className, className) 
    } as any)
  }
  
  return (
    <button
      className={cn("outline-none", className)}
      {...props}
    >
      {children}
    </button>
  )
}

interface DropdownMenuContentProps extends React.HTMLAttributes<HTMLDivElement> {
  align?: 'start' | 'center' | 'end'
  onClose?: () => void
}

export function DropdownMenuContent({ 
  children, 
  className, 
  align = 'end',
  onClose,
  ...props 
}: DropdownMenuContentProps) {
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose?.()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [onClose])

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-full mt-1 min-w-[8rem] overflow-hidden rounded-md border bg-white dark:bg-gray-800 shadow-lg z-50 animate-in fade-in-0 zoom-in-95",
        alignClasses[align],
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

interface DropdownMenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  inset?: boolean
}

export function DropdownMenuItem({ 
  children, 
  className, 
  inset,
  onClick,
  ...props 
}: DropdownMenuItemProps) {
  return (
    <button
      className={cn(
        "relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 focus:bg-gray-100 dark:focus:bg-gray-700",
        inset && "pl-8",
        className
      )}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

interface DropdownMenuSeparatorProps extends React.HTMLAttributes<HTMLDivElement> {}

export function DropdownMenuSeparator({ className, ...props }: DropdownMenuSeparatorProps) {
  return (
    <div
      className={cn("my-1 h-px bg-gray-200 dark:bg-gray-600", className)}
      {...props}
    />
  )
}

interface DropdownMenuLabelProps extends React.HTMLAttributes<HTMLDivElement> {
  inset?: boolean
}

export function DropdownMenuLabel({ 
  children, 
  className, 
  inset,
  ...props 
}: DropdownMenuLabelProps) {
  return (
    <div
      className={cn(
        "px-2 py-1.5 text-sm font-semibold text-gray-900 dark:text-gray-100",
        inset && "pl-8",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// Export individual components that might be used
export {
  DropdownMenu as DropdownMenuRoot
}
