import { useState, useEffect, useRef } from "react";
import { Sidebar } from "../components/Sidebar";
import { Message } from "../components/Message";
import { Auth } from "../components/Auth";
import { supabase } from "../lib/supabase";
import { streamChat } from "../lib/api";
import { Send, Sparkles, ChevronDown, LogOut } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [session, setSession] = useState(null);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [model, setModel] = useState("llama-3.3-70b");
  const messagesEndRef = useRef(null);

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

  const handleSelectChat = (id) => setActiveChatId(id);

  const handleDeleteChat = (id) => {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...activeChat.messages, userMessage];

    // Update chat with user message and set title if it's the first message
    const updatedChats = chats.map((c) =>
      c.id === activeChatId
        ? {
            ...c,
            messages: updatedMessages,
            title:
              c.messages.length === 0 ? input.slice(0, 30) + "..." : c.title,
          }
        : c
    );
    setChats(updatedChats);
    setInput("");
    setIsLoading(true);

    try {
      let assistantContent = "";
      const assistantMessage = { role: "assistant", content: "" };

      // Add empty assistant message to show it's "typing"
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, messages: [...updatedMessages, assistantMessage] }
            : c
        )
      );

      await streamChat(updatedMessages, model, (chunk) => {
        assistantContent += chunk;
        setChats((prev) =>
          prev.map((c) =>
            c.id === activeChatId
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

      <main className="flex-1 flex flex-col relative bg-(--bg-primary)">
        {/* Header */}
        <header className="h-16 border-b border-(--glass-border) flex items-center justify-between px-8 bg-(--bg-primary)/80 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="text-(--accent-blue)" size={20} />
            <span className="font-semibold text-lg">
              Cerebras Chat Platform
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 bg-(--bg-accent) px-3 py-1.5 rounded-lg border border-(--glass-border) text-sm cursor-pointer hover:border-(--accent-blue) transition-all">
              <span className="text-(--text-secondary)">Model:</span>
              <span className="font-medium text-(--accent-blue)">{model}</span>
              <ChevronDown size={14} className="text-(--text-secondary)" />
            </div>

            <div className="h-8 w-px bg-(--glass-border)" />

            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end mr-1">
                <span className="text-[10px] text-(--text-secondary) font-bold uppercase tracking-tighter">
                  Signed In As
                </span>
                <span className="text-xs font-medium text-(--text-primary)">
                  {session.user.email}
                </span>
              </div>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-lg bg-(--bg-accent) border border-(--glass-border) text-(--text-secondary) hover:text-red-400 hover:border-red-400/50 transition-all"
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
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-20 h-20 bg-linear-to-br from-(--accent-blue) to-(--accent-purple) rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/20"
              >
                <Sparkles size={40} className="text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-3 tracking-tight">
                How can I help you today?
              </h2>
              <p className="text-(--text-secondary) max-w-md">
                Experience the power of Cerebras with ultra-fast inference and
                intelligent responses.
              </p>

              <div className="grid grid-cols-2 gap-4 mt-12 w-full max-w-2xl">
                {[
                  "Explain quantum computing",
                  "Write a React hook for API calls",
                  "Plan a 3-day trip to Tokyo",
                  "Write a poem about neon rain",
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setInput(prompt)}
                    className="glass-card p-4 text-left hover:bg-(--bg-accent) hover:-translate-y-1 transition-all duration-300"
                  >
                    <p className="text-sm font-medium">{prompt}</p>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full">
              <AnimatePresence>
                {activeChat?.messages?.map((msg, i) => (
                  <Message key={i} {...msg} />
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} className="h-24" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-8 relative">
          <div className="max-w-4xl mx-auto relative group">
            <div className="absolute -inset-1 bg-linear-to-r from-(--accent-blue) to-(--accent-purple) rounded-2xl opacity-20 group-focus-within:opacity-40 transition-opacity blur-sm" />
            <form
              onSubmit={handleSubmit}
              className="relative glass-card bg-(--bg-secondary) flex items-end gap-2 p-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Message Cerebras..."
                rows={1}
                className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-4 text-(--text-primary) placeholder-(--text-secondary) max-h-48"
                style={{ height: "auto" }}
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="primary-btn p-3 aspect-square flex items-center justify-center"
              >
                <Send size={20} className={isLoading ? "animate-pulse" : ""} />
              </button>
            </form>
            <p className="text-[10px] text-(--text-secondary) text-center mt-3 uppercase tracking-widest font-bold">
              Powered by Cerebras SDK • Llama 3.3 70B
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
