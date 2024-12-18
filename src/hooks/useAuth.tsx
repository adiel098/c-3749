import { createContext, useContext, useEffect, useState } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  signOut: () => Promise<void>;
  isLoading: boolean;
  setSession: (session: Session | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  signOut: async () => {},
  isLoading: true,
  setSession: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    const initSession = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("AuthProvider - Initial session:", initialSession ? "Exists" : "None");
        
        if (mounted) {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error getting session:", error);
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return;
      
      console.log("AuthProvider - Auth state changed:", _event);
      console.log("AuthProvider - New session:", newSession ? "Exists" : "None");
      
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const updateSession = (newSession: Session | null) => {
    setSession(newSession);
    setUser(newSession?.user ?? null);
  };

  return (
    <AuthContext.Provider value={{ 
      session, 
      user, 
      signOut, 
      isLoading, 
      setSession: updateSession 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};