import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  TrendingUp,
  BarChart3,
  Wallet,
  History,
  Settings2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface MobileNavBarProps {
  onAuthRequired: () => void;
}

export const MobileNavBar = ({ onAuthRequired }: MobileNavBarProps) => {
  const location = useLocation();
  const { session } = useAuth();

  const menuItems = [
    { path: "/", icon: TrendingUp, label: "Trade" },
    { path: "/portfolio", icon: BarChart3, label: "Portfolio" },
    { path: "/wallet", icon: Wallet, label: "Wallet" },
    { path: "/history", icon: History, label: "History" },
    { path: "/settings", icon: Settings2, label: "Settings" },
  ];

  const handleClick = (e: React.MouseEvent, requiresAuth: boolean) => {
    if (requiresAuth && !session) {
      e.preventDefault();
      onAuthRequired();
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/30 backdrop-blur-xl border-t border-white/10">
      <div className="flex justify-around items-center h-16">
        {menuItems.map(({ path, icon: Icon, label }) => (
          <Link
            key={path}
            to={path}
            onClick={(e) => handleClick(e, path !== "/")}
            className={cn(
              "flex flex-col items-center justify-center w-full h-full px-2 text-xs",
              "text-muted-foreground hover:text-foreground transition-colors",
              location.pathname === path && "text-primary"
            )}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span>{label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
};