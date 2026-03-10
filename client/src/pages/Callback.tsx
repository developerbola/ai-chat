import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2Icon } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthCallback() {
  const navigate = useNavigate();
  useEffect(() => {
    const signin = async () => {
      await supabase.auth.getSession();
      navigate("/");
    };
    signin();
  }, []);

  return (
    <div className="h-screen w-full grid place-items-center">
      <Loader2Icon className="animate-spin" />
    </div>
  );
}
