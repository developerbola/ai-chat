import { supabase } from "@/lib/supabase";
import { useEffect } from "react";
import useSessionStore from "@/store/sessionStore.js";
import Auth from "@/pages/Auth";
import { useLocation } from "react-router-dom";

interface SessionProviderProps {
  children: React.ReactNode;
}

const SessionProvider = ({ children }: SessionProviderProps) => {
  const { session, setSession } = useSessionStore();
  const storedSession = sessionStorage.getItem("user");
  const { pathname } = useLocation();

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
  const isSafe = pathname == "/privacy" || pathname == "/terms";

  return storedSession || session || isSafe ? children : <Auth />;
};

export default SessionProvider;
