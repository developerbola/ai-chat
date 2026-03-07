import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2Icon } from "lucide-react";

export default function AuthCallback() {
  useEffect(() => {
    supabase.auth.getSession();
  }, []);

  return (
    <div className="h-screen w-full grid place-items-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}
