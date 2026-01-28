import { Trash2, SquarePen, LogOut } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  chats: any[];
  activeChatId: string | null;
  session: any;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
  onSignOut: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  session,
  onNewChat,
  onSelectChat,
  onDeleteChat,
  onSignOut,
}) => {
  return (
    <div className="w-72 h-screen bg-sidebar border-r border-border/70 flex flex-col p-4">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 w-full py-3 mb-6 bg-secondary/50 hover:bg-secondary transition-all group"
      >
        <SquarePen size={18} />
        <span className="font-medium">New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div className="text-muted-foreground text-[10px] uppercase font-bold tracking-widest px-3 mb-2">
          Recent Chats
        </div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`flex items-center group relative hover:bg-accent py-2 px-4 rounded-[11px] cursor-pointer transition-all ${
              activeChatId === chat.id
                ? "bg-accent/80 border border-white/5 shadow-sm"
                : ""
            }`}
          >
            <span
              className={`truncate flex-1 ${activeChatId === chat.id ? "font-semibold text-white" : "text-white/70"}`}
            >
              {chat.title || "Untitled Chat"}
            </span>
            <Button
              size={"icon-sm"}
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-border/50">
        <div className="flex items-center justify-between px-2 py-2">
          <div className="flex flex-col">
            <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-tighter">
              Account
            </span>
            <span className="text-sm font-medium text-white/90 truncate max-w-[140px]">
              {session?.user?.user_metadata?.name || session?.user?.email}
            </span>
          </div>
          <button
            onClick={onSignOut}
            className="p-2 rounded-xl bg-accent/50 text-white/60 hover:text-red-400 hover:bg-red-400/10 transition-all"
            title="Sign Out"
          >
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
