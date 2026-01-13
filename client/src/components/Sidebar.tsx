import { Trash2, Settings, SquarePen } from "lucide-react";
import { Button } from "./ui/button";

interface SidebarProps {
  chats: any[];
  activeChatId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  onDeleteChat: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
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
            className={`flex items-center group relative hover:bg-accent py-2 px-4 rounded-[11px] ${
              activeChatId === chat.id ? "active" : ""
            }`}
          >
            <span className="truncate flex-1">
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

      <div className="mt-auto pt-4 border-t space-y-2">
        <div>
          <Settings size={16} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};
