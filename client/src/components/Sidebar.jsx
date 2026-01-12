import { MessageSquare, Plus, Trash2, Settings, Github } from "lucide-react";

export const Sidebar = ({
  chats,
  activeChatId,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  return (
    <div className="w-72 h-screen bg-[var(--bg-secondary)] border-r border-[var(--glass-border)] flex flex-col p-4">
      <button
        onClick={onNewChat}
        className="flex items-center justify-center gap-2 w-full glass-card py-3 mb-6 hover:bg-[var(--bg-accent)] transition-all group"
      >
        <Plus
          size={18}
          className="group-hover:rotate-90 transition-transform"
        />
        <span className="font-medium">New Chat</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-2">
        <div className="text-[var(--text-secondary)] text-[10px] uppercase font-bold tracking-widest px-3 mb-2">
          Recent Chats
        </div>
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`sidebar-item group relative ${
              activeChatId === chat.id ? "active" : ""
            }`}
          >
            <MessageSquare size={16} />
            <span className="truncate flex-1">
              {chat.title || "Untitled Chat"}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteChat(chat.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="mt-auto pt-4 border-t border-[var(--glass-border)] space-y-2">
        <div className="sidebar-item">
          <Settings size={16} />
          <span>Settings</span>
        </div>
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          className="sidebar-item"
        >
          <Github size={16} />
          <span>Github</span>
        </a>
      </div>
    </div>
  );
};
