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

type ChatItemProps = {
  chat_id?: string;
  title?: string;
};
const ChatItem = ({ chat }: { chat: ChatItemProps }) => {
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSelectChat = (id: string | undefined) => navigate(`/chat/${id}`);

  // const handleDeleteChat = (id: string) => {
  //   const filtered = chats.filter((c) => c.id !== id);
  //   setChats(filtered);
  //   if (activeChatId === id) {
  //     if (filtered.length > 0) {
  //       navigate(`/chat/${filtered[0].id}`);
  //     } else {
  //       navigate("/");
  //     }
  //   }
  // };

  return (
    <div
      onClick={() => handleSelectChat(chat.chat_id)}
      className={cn(
        "group flex items-center h-9 pl-4 pr-2 py-0.5 rounded-sm cursor-pointer hover:bg-white/13 chat-history-item",
        activeChatId === chat.chat_id && "bg-white/10",
      )}
    >
      <span className="truncate flex-1 text-ellipsis text-[13px]">{chat.title}</span>

      <DropdownMenu onOpenChange={(open) => setDropdownOpen(open)}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon-sm"
            variant="ghost"
            className={cn(
              "transition-opacity",
              "opacity-0 group-hover:opacity-100",
              dropdownOpen && "opacity-100",
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis size={14} />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" side="right" className="w-36">
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <PenLine size={14} className="mr-2" /> Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <Pin size={14} className="mr-2" /> Pin
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              //   handleDeleteChat(chat.chat_id);
            }}
          >
            <Archive size={14} className="mr-2" /> Archive
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              //   handleDeleteChat(chat.chat_id);
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
