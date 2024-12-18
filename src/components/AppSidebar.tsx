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
    <Sidebar className="border-r border-gray-700 bg-gray-800">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-xl text-gray-400 px-4 py-2">Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link 
                      to={item.url} 
                      className={`flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                        location.pathname === item.url 
                          ? 'bg-gray-700 text-white' 
                          : 'text-gray-400 hover:bg-gray-700/50 hover:text-white'
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${
                        location.pathname === item.url 
                          ? 'text-white' 
                          : 'text-gray-400'
                      }`} />
                      <span className="text-sm">{item.title}</span>
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