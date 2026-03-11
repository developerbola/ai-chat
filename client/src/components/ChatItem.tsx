import { Archive, Ellipsis, Trash, PenLine, Pin } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "./ui/button";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ChatItemProps {
  chat: {
    chat_id?: string;
    title?: string;
  };
  handleDeleteChat: (id: string) => void;
  onChatUpdated?: () => void;
}

const ChatItem = ({ chat, handleDeleteChat, onChatUpdated }: ChatItemProps) => {
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(chat.title || "");
  const [isHovered, setIsHovered] = useState(false);

  const handleSelectChat = (id: string | undefined) => navigate(`/chat/${id}`);

  const handleRename = async (e: React.SyntheticEvent) => {
    e.stopPropagation();
    if (!chat.chat_id || !newTitle.trim()) return;

    try {
      await api("post", "/rename-chat", {
        chat_id: chat.chat_id,
        title: newTitle.trim(),
      });
      toast.success("Chat renamed");
      setIsRenaming(false);
      if (onChatUpdated) onChatUpdated();
    } catch (error) {
      toast.error("Failed to rename chat");
    }
  };

  const handlePin = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chat.chat_id) return;

    try {
      await api("post", "/pin-chat", { chat_id: chat.chat_id });
      toast.success("Chat pinned");
      if (onChatUpdated) onChatUpdated();
    } catch (error) {
      toast.error("Failed to pin chat");
    }
  };

  const handleArchive = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!chat.chat_id) return;

    try {
      await api("post", "/archive-chat", { chat_id: chat.chat_id });
      toast.success("Chat archived");
      if (onChatUpdated) onChatUpdated();
    } catch (error) {
      toast.error("Failed to archive chat");
    }
  };

  return (
    <div
      onClick={() => handleSelectChat(chat.chat_id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "flex items-center h-9 pl-3 pr-2 rounded-sm cursor-pointer hover:bg-white/13 chat-history-item",
        activeChatId === chat.chat_id && "bg-white/10",
      )}
    >
      {isRenaming ? (
        <input
          autoFocus
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onBlur={handleRename}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleRename(e);
            if (e.key === "Escape") setIsRenaming(false);
          }}
          className="flex-1 bg-transparent text-[14px] text-white/80 outline-none"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <span className="truncate flex-1 text-ellipsis text-[14px]">
          {chat.title}
        </span>
      )}

      <DropdownMenu onOpenChange={(open) => setDropdownOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className={cn(
              "transition-opacity",
              "opacity-0",
              (isHovered || dropdownOpen) && "opacity-100",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis size={14} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" side="right" className="w-36">
          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setIsRenaming(true); }}>
            <PenLine size={14} className="mr-2" /> Rename
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handlePin}>
            <Pin size={14} className="mr-2" /> Pin
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleArchive}>
            <Archive size={14} className="mr-2" /> Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteChat(chat.chat_id as string);
            }}
            variant="destructive"
          >
            <Trash size={14} className="mr-2" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ChatItem;
