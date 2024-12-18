import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { toastStyles, toastConfig } from "@/utils/toastStyles";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session.user);
    
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Sign Out Failed ❌",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.error.icon}
            <span>{error.message}</span>
          </div>
        ),
        className: toastStyles.error.className,
        ...toastConfig,
      });
    } else {
      toast({
        title: "Goodbye! 👋",
        description: (
          <div className="flex items-center gap-2">
            {toastStyles.logout.icon}
            <span>You've been successfully signed out. See you soon!</span>
          </div>
        ),
        className: toastStyles.logout.className,
        ...toastConfig,
      });
      setUser(null);
      navigate("/auth");
    }
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
