import { useState } from "react";
import { supabase } from "../lib/supabase";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
export const Auth = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert("Check your email for the confirmation link!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          queryParams: {
            access_type: "offline",
            prompt: "consent",
          },
          redirectTo: "https://chatt-aii.vercel.app",
        },
      });
      if (error) throw error;

      if (data?.url) {
        const width = 500;
        const height = 600;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;
        window.open(
          data.url,
          "google-login",
          `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,status=yes`
        );
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-(--bg-primary) flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            Welcome to{" "}
            <span className="text-(--accent-blue)">Cerebras Chat</span>
          </h1>
          <p className="text-(--text-secondary)">
            Sign in to access your personal AI assistant
          </p>
        </div>

        <div className="p-8 bg-(--bg-secondary)/50">
          <form onSubmit={handleAuth} className="space-y-6">
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-2 uppercase tracking-wider">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-(--bg-accent)/50 border rounded-xl px-4 py-3 text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--accent-blue)/50 transition-all"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-(--text-secondary) mb-2 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-(--bg-accent)/50 border rounded-xl px-4 py-3 text-(--text-primary) focus:outline-none focus:ring-2 focus:ring-(--accent-blue)/50 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 flex items-center justify-center gap-2 font-semibold"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSignUp ? (
                <>
                  <UserPlus size={20} /> Create Account
                </>
              ) : (
                <>
                  <LogIn size={20} /> Sign In
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-(--bg-secondary) px-2 text-(--text-secondary)">
                Or continue with
              </span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-white border border-gray-300 hover:bg-gray-50 transition-all rounded-xl py-4 flex items-center justify-center gap-3 font-semibold text-gray-700 shadow-sm"
          >
            <svg viewBox="0 0 24 24" width="20" height="20">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </button>

          <div className="mt-8 pt-8 border-t">
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="w-full text-center text-sm text-(--text-secondary) hover:text-(--text-primary) transition-colors"
            >
              {isSignUp
                ? "Already have an account? Sign In"
                : "Need an account? Create one"}
            </button>
          </div>
        </div>
      </div>
      <div className="absolute top-[96%] left-[85%] w-fit flex gap-3 opacity-40 *:text-xs">
        <Link to={"/privacy"}>Privacy Policy</Link>
        <Link to={"/terms"}>Terms of usage</Link>
      </div>
    </div>
  );
};
