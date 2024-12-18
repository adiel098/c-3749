import { AlertCircle, CheckCircle, Info, X } from "lucide-react";

export const toastStyles = {
  success: {
    className: "bg-success/10 text-success border border-success/20 shadow-lg",
    icon: <CheckCircle className="h-5 w-5" />,
  },
  error: {
    className: "bg-warning/10 text-warning border border-warning/20 shadow-lg",
    icon: <AlertCircle className="h-5 w-5" />,
  },
  info: {
    className: "bg-primary/10 text-primary border border-primary/20 shadow-lg",
    icon: <Info className="h-5 w-5" />,
  },
};

export const ToastClose = () => (
  <button className="rounded-full p-1 hover:bg-card/80 transition-colors">
    <X className="h-4 w-4" />
  </button>
);