import * as React from "react"
import { cn } from "@/lib/utils"

interface SidebarContextValue {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = React.createContext<SidebarContextValue>({
  collapsed: false,
  setCollapsed: () => {},
})

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)
  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      {children}
    </SidebarContext.Provider>
  )
}

interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode
}

export function Sidebar({ children, className, ...props }: SidebarProps) {
  const { collapsed } = React.useContext(SidebarContext)
  return (
    <aside
      className={cn(
        "h-screen sticky top-0 border-l bg-card text-card-foreground",
        collapsed ? "w-16" : "w-64",
        className
      )}
      {...props}
    >
      {children}
    </aside>
  )
}

export function SidebarTrigger() {
  const { collapsed, setCollapsed } = React.useContext(SidebarContext)
  return (
    <button
      onClick={() => setCollapsed(!collapsed)}
      className="p-2 rounded-lg hover:bg-accent"
    >
      {collapsed ? "→" : "←"}
    </button>
  )
}

export function SidebarContent({ children }: { children: React.ReactNode }) {
  return <div className="p-4 space-y-4">{children}</div>
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  return <div className="space-y-2">{children}</div>
}

export function SidebarGroupLabel({ children }: { children: React.ReactNode }) {
  const { collapsed } = React.useContext(SidebarContext)
  if (collapsed) return null
  return <div className="text-sm font-medium text-muted-foreground">{children}</div>
}

export function SidebarGroupContent({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  return <nav className="space-y-1">{children}</nav>
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

interface SidebarMenuButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  asChild?: boolean
}

export function SidebarMenuButton({
  children,
  asChild,
  className,
  ...props
}: SidebarMenuButtonProps) {
  const { collapsed } = React.useContext(SidebarContext)
  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp
      className={cn(
        "flex items-center w-full px-2 py-2 text-sm rounded-lg hover:bg-accent group",
        collapsed && "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}