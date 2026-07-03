import { useEffect, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "../store/authStore";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        useAuthStore.setState({
          session: null,
          role: null,
          guardian: null,
          child: null,
          administrator: null,
          linkedChildren: [],
        });
        return;
      }
      useAuthStore.setState({ session });
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return children;
}
