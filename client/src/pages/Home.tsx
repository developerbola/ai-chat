import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Message } from "../components/Message";
import { Auth } from "../components/Auth";
import { supabase } from "../lib/supabase";
import { streamChat } from "../lib/api";
import { LogOut, ArrowUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../lib/utils";

function Home() {
  const [session, setSession] = useState<any>(null);
  const [chats, setChats] = useState<any[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("llama-3.3-70b");
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
        setActiveChatId(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setChats([]);
    setActiveChatId(null);
  };

  const activeChat = chats.find((c) => c.id === activeChatId) || chats[0];

  useEffect(() => {
    if (session) {
      localStorage.setItem(`chats_${session.user.id}`, JSON.stringify(chats));
    }
  }, [chats, session]);

  // Load chats for specific user when session changes
  useEffect(() => {
    if (session) {
      const saved = localStorage.getItem(`chats_${session.user.id}`);
      if (saved) {
        const parsed = JSON.parse(saved);
        setChats(parsed);
        setActiveChatId(parsed[0]?.id);
      } else {
        const defaultChat = [{ id: "1", title: "New Chat", messages: [] }];
        setChats(defaultChat);
        setActiveChatId("1");
      }
    }
  }, [session]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const handleNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [],
    };
    setChats([newChat, ...chats]);
    setActiveChatId(newChat.id);
  };

  const handleSelectChat = (id: string) => setActiveChatId(id);

  const handleDeleteChat = (id: string) => {
    const filtered = chats.filter((c) => c.id !== id);
    if (filtered.length === 0) {
      const defaultChat = { id: "1", title: "New Chat", messages: [] };
      setChats([defaultChat]);
      setActiveChatId("1");
    } else {
      setChats(filtered);
      if (activeChatId === id) setActiveChatId(filtered[0].id);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    let currentChatId = activeChatId;
    let updatedMessages: any[];

    if (!activeChat) {
      const newChatId = Date.now().toString();
      updatedMessages = [userMessage];
      const newChat = {
        id: newChatId,
        title: input.slice(0, 30) + "...",
        messages: updatedMessages,
      };
      setChats([newChat, ...chats]);
      setActiveChatId(newChatId);
      currentChatId = newChatId;
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
            : c
        )
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
            : c
        )
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
              : c
          )
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
        activeChatId={activeChatId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteChat={handleDeleteChat}
      />

      <main className="flex-1 flex flex-col relative">
        <header className="h-16 border-b flex items-center justify-between px-8 z-10">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-lg">Chat AI</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
                  Signed In As
                </span>
                <span className="text-xs font-medium text-primary">
                  {session?.user?.user_metadata?.name}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg bg-accent border text-secondary hover:text-red-400 hover:border-red-400/50 transition-all"
                title="Sign Out"
              >
                <LogOut size={18} />
              </button>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {activeChat?.messages.length === 0 ? (
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
                      : "bg-white text-black"
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
