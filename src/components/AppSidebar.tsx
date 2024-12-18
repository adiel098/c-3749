import { LineChart, Settings, Wallet, History, ChartBar } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  {
    title: "Trade",
    url: "/",
    icon: LineChart,
  },
  {
    title: "Portfolio",
    url: "/portfolio",
    icon: ChartBar,
  },
  {
    title: "History",
    url: "/history",
    icon: History,
  },
  {
    title: "Wallet",
    url: "/wallet",
    icon: Wallet,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg transition-colors ${
                        location.pathname === item.url 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-secondary/40'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${
                        location.pathname === item.url 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}