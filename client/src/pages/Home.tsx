import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Message } from "../components/Message";
import { Auth } from "../components/Auth";
import { supabase } from "../lib/supabase";
import { streamChat } from "../lib/stream";
import { ArrowUp } from "lucide-react";
import { cn } from "../lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api";

function Home() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const handleNewChat = () => {
    navigate("/");
  };

  const handleSelectChat = (id: string) => navigate(`/chat/${id}`);

  const handleDeleteChat = (id: string) => {};

  const handleSubmit = async (e: React.FormEvent) => {};

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar session={session} onSignOut={handleSignOut} />

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b flex items-center justify-between px-3 z-10">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="font-semibold text-lg">Chat AI</span>
          </div>
        </header>

        {/* Messages */}
        {/* <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!activeChat || activeChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-medium mb-3 tracking-tight">
                How can I help you today?
              </h2>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full pt-5">
              {activeChat?.messages?.map((msg: any, i: number) => (
                <Message key={i} {...msg} />
              ))}
              <div ref={messagesEndRef} className="h-24" />
            </div>
          )}
        </div> */}

        {/* Input Area */}
        <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
          <div className="relative bg-secondary/40 backdrop-blur-2xl border border-white/5 rounded-3xl overflow-hidden transition-all focus-within:border-white/10">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end w-full"
            >
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Type your message..."
                className="w-full min-h-[50px] max-h-[500px] bg-transparent! py-4 pl-6 pr-14 border-none resize-none text-white/90 placeholder:text-white/30 text-[16px] leading-[1.6] focus:ring-0 focus:outline-none"
              />

              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "absolute right-4 bottom-4 h-10 w-10 flex items-center justify-center rounded-2xl transition-colors duration-200",
                  !input.trim() || isLoading
                    ? "bg-white/5 text-white/20 cursor-not-allowed"
                    : "bg-white text-black hover:bg-white/90",
                )}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                ) : (
                  <ArrowUp size={22} strokeWidth={2.5} />
                )}
              </Button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
