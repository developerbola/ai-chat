import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Message } from "../components/Message";
import { Auth } from "../components/Auth";
import { supabase } from "../lib/supabase";
import { streamChat } from "../lib/api";
import { ArrowUp } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

function Home() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const activeChatId = id;
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const model = "llama-3.3-70b";
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) {
        setChats([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setChats([]);
    navigate("/");
  };

  const activeChat = chats.find((c) => c.id === activeChatId);

  useEffect(() => {
    if (session) {
      localStorage.setItem(`chats_${session.user.id}`, JSON.stringify(chats));
    }
  }, [chats, session]);

  useEffect(() => {
    if (session) {
      const saved = localStorage.getItem(`chats_${session.user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        if (!id && parsed.length > 0) {
          navigate(`/chat/${parsed[0].id}`, { replace: true });
        }
      }
    }
  }, [session, id, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleNewChat = () => {
    navigate("/");
  };

  const handleSelectChat = (id: string) => navigate(`/chat/${id}`);

  const handleDeleteChat = (id: string) => {
    const filtered = chats.filter((c) => c.id !== id);
    setChats(filtered);
    if (activeChatId === id) {
      if (filtered.length > 0) {
        navigate(`/chat/${filtered[0].id}`);
      } else {
        navigate("/");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    let currentChatId = activeChatId;
    let updatedMessages: any[];

    if (!activeChat) {
      const newChatId = crypto.randomUUID();
      updatedMessages = [userMessage];
      const newChat = {
        id: newChatId,
        title: input.slice(0, 30) + (input.length > 30 ? "..." : ""),
        messages: updatedMessages,
      };
      setChats([newChat, ...chats]);
      currentChatId = newChatId;
      navigate(`/chat/${newChatId}`, { replace: true });
    } else {
      currentChatId = activeChatId!;
      updatedMessages = [...activeChat.messages, userMessage];
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? {
                ...c,
                messages: updatedMessages,
                title:
                  c.messages.length === 0
                    ? input.slice(0, 30) + "..."
                    : c.title,
              }
            : c,
        ),
      );
    }

    setInput("");
    setIsLoading(true);

    try {
      let assistantContent = "";
      const assistantMessage = { role: "assistant", content: "" };

      // Add empty assistant message to show it's "typing"
      setChats((prev) =>
        prev.map((c) =>
          c.id === currentChatId
            ? { ...c, messages: [...updatedMessages, assistantMessage] }
            : c,
        ),
      );

      await streamChat(updatedMessages, model, (chunk) => {
        assistantContent += chunk;
        setChats((prev) =>
          prev.map((c) =>
            c.id === currentChatId
              ? {
                  ...c,
                  messages: [
                    ...updatedMessages,
                    { role: "assistant", content: assistantContent },
                  ],
                }
              : c,
          ),
        );
      });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) {
    return <Auth />;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        chats={chats}
        activeChatId={activeChatId ?? null}
        session={session}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">Chat AI</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {!activeChat || activeChat.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-3xl font-medium mb-3 tracking-tight">
                How can I help you today?
              </h2>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full pt-5">
              <AnimatePresence>
                {activeChat?.messages?.map((msg: any, i: number) => (
                  <Message key={i} {...msg} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-24" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="relative flex items-end w-full bg-(--bg-secondary)/40 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.3)] focus-within:border-white/10 transition-all overflow-hidden"
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
                placeholder="Message Cerebras..."
                className="w-full min-h-[64px] py-5 pl-7 pr-16 bg-transparent border-none focus:ring-0 resize-none text-[16px] leading-[1.6] text-white/90 placeholder:text-white/30"
              />
              <div className="absolute right-3 bottom-3">
                <Button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className={cn(
                    "h-10 w-10 flex items-center justify-center rounded-2xl",
                    !input.trim() || isLoading
                      ? "bg-white/5 text-white/20 cursor-not-allowed"
                      : "bg-white text-black",
                  )}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  ) : (
                    <ArrowUp size={22} strokeWidth={2.5} />
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
