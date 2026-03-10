import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import useSessionStore from "@/store/sessionStore.js";
import Auth from "@/pages/Auth";

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps) => {
  const { session, setSession } = useSessionStore();
  const storedSession = sessionStorage.getItem("user");

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return storedSession || session ? children : <Auth />;
};

export default SessionProvider;
