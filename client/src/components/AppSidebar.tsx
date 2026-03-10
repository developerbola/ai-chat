// AppSidebar.tsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Trash2, SquarePen, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api";

interface SidebarProps {
  session: any;
  onSignOut: () => void;
}

export function AppSidebar({ session, onSignOut }: SidebarProps) {
  const navigate = useNavigate();
  const { id: activeChatId } = useParams();
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const fetchChats = async () => {
      const history = await api("/chats-history");
      setChats(history.data || []);
    };
    fetchChats();
  }, []);

  const handleNewChat = () => {
    const newChatId = crypto.randomUUID();
    const newChat = {
      id: newChatId,
      title: "New Chat",
      messages: [],
    };
    setChats([newChat, ...chats]);
    navigate(`/chat/${newChatId}`);
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

  return (
    <Sidebar className="border-r p-3 px-2">
      <SidebarContent className="gap-0">
        <Button
          onClick={handleNewChat}
          className="w-full justify-start gap-2 rounded-[8px] py-5 px-4 text-[14px]"
          variant="ghost"
        >
          <SquarePen size={16} />
          New Chat
        </Button>
        <Button
          onClick={() => {}}
          className="w-full justify-start gap-2 rounded-[8px] py-5 px-4 text-[14px]"
          variant="ghost"
        >
          <Search size={16} />
          Search chats
        </Button>

        <SidebarGroup>
          <SidebarGroupLabel>Recent Chats</SidebarGroupLabel>
          <SidebarMenu>
            {chats.map((chat) => (
              <SidebarMenuItem key={chat.id}>
                <SidebarMenuButton
                  onClick={() => handleSelectChat(chat.id)}
                  isActive={activeChatId === chat.id}
                  className="group"
                >
                  <span className="truncate flex-1">{chat.title}</span>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteChat(chat.id);
                    }}
                  >
                    <Trash2 size={14} />
                  </Button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white/5 hover:bg-white/8 rounded-sm cursor-pointer">
        <div className="flex items-center justify-between px-1.5">
          <div className="flex items-center justify-center gap-2">
            <Avatar className="size-9">
              <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
              <AvatarFallback>
                {session?.user?.user_metadata?.name?.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col mt-[3px]">
              <span className="text-[13px] font-medium truncate max-w-[140px]">
                {session?.user?.user_metadata?.name || session?.user?.email}
              </span>
              <p className="text-[12px] opacity-80">Free</p>
            </div>
          </div>
          <div>
            <Button
              variant={"outline"}
              className="rounded-full text-[11px] h-7"
            >
              Upgrade
            </Button>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
