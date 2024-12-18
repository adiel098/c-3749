import { AlertCircle, CheckCircle, Info, X, LogOut } from "lucide-react";

export const toastStyles = {
  success: {
    className: "bg-success/20 text-success border border-success/30 shadow-lg backdrop-blur-sm",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  error: {
    className: "bg-warning/20 text-warning border border-warning/30 shadow-lg backdrop-blur-sm",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  info: {
    className: "bg-primary/20 text-primary border border-primary/30 shadow-lg backdrop-blur-sm",
    icon: <Info className="h-5 w-5" />,
  },
  logout: {
    className: "bg-accent/20 text-accent border border-accent/30 shadow-lg backdrop-blur-sm",
    icon: <LogOut className="h-5 w-5" />,
  }
};

export const ToastClose = () => (
  <button className="rounded-full p-1 hover:bg-card/80 transition-colors">
    <X className="h-4 w-4" />
  </button>
);

// Common toast configuration
export const toastConfig = {
  duration: 3000,
  className: "animate-in slide-in-from-top-full",
};