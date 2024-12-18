import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  BarChart3Icon,
  WalletIcon,
  HistoryIcon,
  Settings2Icon,
  TrendingUpIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

export const AppSidebar = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const menuItems = [
    { path: "/", icon: TrendingUpIcon, label: "Trade" },
    { path: "/portfolio", icon: BarChart3Icon, label: "Portfolio" },
    { path: "/wallet", icon: WalletIcon, label: "Wallet" },
    { path: "/history", icon: HistoryIcon, label: "History" },
    { path: "/settings", icon: Settings2Icon, label: "Settings" },
  ];

  return (
    <Sidebar className="border-r border-border/40 bg-gradient-to-b from-background/95 to-background/50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex h-[60px] items-center px-6">
            <Link to="/" className="flex items-center gap-2 font-semibold">
              <span className="text-xl gradient-text">CryptoTrade</span>
            </Link>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ path, icon: Icon, label }) => (
                <SidebarMenuItem key={path}>
                  <Link to={path} className="w-full">
                    <SidebarMenuButton
                      className={cn(
                        "w-full flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-colors hover:text-foreground",
                        "hover:bg-accent/50",
                        isActive(path) && "bg-accent/50 text-foreground"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};