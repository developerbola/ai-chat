import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppSidebar } from "../components/AppSidebar";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";
import { Message } from "../components/Message";
import { streamChat } from "../lib/stream";
import { ArrowUp } from "lucide-react";
import { cn } from "../lib/utils";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { api } from "@/lib/api";
import { toast } from "sonner";

function Home() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(id || null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesRef = useRef(messages);
  const streamingMsgIndexRef = useRef<number>(-1);

  // Sync chatId with route parameter
  useEffect(() => {
    setChatId(id || null);
  }, [id]);

  // Keep ref in sync with state
  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  // Load messages when chatId changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (chatId) {
        try {
          const response = await api("post", "/messages", { chat_id: chatId });
          if (response.messages) {
            setMessages(response.messages);
          }
        } catch (error) {
          console.error("Failed to fetch messages:", error);
          toast.error("Failed to load messages");
        }
      } else {
        setMessages([]);
      }
    };
    fetchMessages();
  }, [chatId]);

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  // const handleNewChat = () => {
  //   navigate("/");
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    // Create a new chat if we don't have a chatId
    let currentChatId = chatId;
    if (!currentChatId) {
      try {
        const response = await api("post", "/add-chat", {
          title: trimmed.slice(0, 30) + (trimmed.length > 30 ? "..." : ""),
        });
        const newChatId = response.chat_id;
        currentChatId = newChatId;
        setChatId(newChatId);
        navigate(`/chat/${newChatId}`, { replace: true });
      } catch (error) {
        console.error("Failed to create chat:", error);
        toast.error("Failed to create chat");
        return;
      }
    }

    const userMessage: { role: "user"; content: string } = {
      role: "user",
      content: trimmed,
    };

    // Add user message first
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Add assistant message and capture its index in a ref
      setMessages((prev) => {
        const idx = prev.length;
        streamingMsgIndexRef.current = idx;
        return [...prev, { role: "assistant", content: "" }];
      });

      // Use the captured index in the stream callback
      await streamChat(
        [...messagesRef.current, userMessage],
        currentChatId,
        (chunk: string) => {
          setMessages((prev) => {
            const updated = [...prev];
            const idx = streamingMsgIndexRef.current;
            if (
              idx >= 0 &&
              idx < updated.length &&
              updated[idx].role === "assistant"
            ) {
              updated[idx] = {
                ...updated[idx],
                content: updated[idx].content + chunk,
              };
            }
            return updated;
          });
        },
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <AppSidebar />

      <main className="flex-1 flex flex-col relative">
        <header className="h-14 border-b flex items-center justify-between px-3 z-10">
          <div className="flex items-center gap-3">
            <SidebarTrigger />
            <span className="font-semibold text-lg">Chat AI</span>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center">
              <h2 className="text-2xl md:text-3xl font-medium mb-3 tracking-tight">
                How can I help you today?
              </h2>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto w-full pt-5">
              {messages.map((msg, i) => (
                <Message key={i} {...msg} />
              ))}
              <div ref={messagesEndRef} className="h-24" />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="w-full max-w-screen md:max-w-3xl mx-auto px-4 pb-6 pt-2">
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
                placeholder="Type your message ..."
                className="w-full min-h-[50px] max-h-[300px] md:max-h-[500px] bg-transparent! py-4 pl-6 pr-14 border-none resize-none text-white/90 placeholder:text-white/30 text-[16px] leading-[1.6] focus:ring-0 focus:outline-none"
              />

              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={cn(
                  "absolute right-2 bottom-2 h-10 w-10 flex items-center justify-center rounded-2xl transition-colors duration-200",
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
