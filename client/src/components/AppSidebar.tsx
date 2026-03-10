import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SquarePen, Search, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
} from "@/components/ui/sidebar";
import { api } from "@/lib/api";

import ChatItem from "./ChatItem";
import UserDialog from "./UserDialog";

export function AppSidebar() {
  const navigate = useNavigate();
  const [chats, setChats] = useState<{ chat_id?: string; title?: string }[]>(
    [],
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    const fetchChats = async () => {
      const history = await api("get", "/chats-history");
      setChats(history.data || []);
    };
    fetchChats();
  }, []);

  const handleNewChat = () => {
    navigate("/");
  };

  const handleSearch = () => {
    setShowSearch((prev) => !prev);
    setShowArchived(false);
  };

  const handleArchived = async () => {
    setShowArchived((prev) => !prev);
    setShowSearch(false);
    if (!showArchived) {
      try {
        const archived = await api("get", "/chats-history?archived=true");
        setChats(archived.data || []);
      } catch (error) {
        console.error("Failed to fetch archived chats:", error);
      }
    } else {
      // Return to normal chats when toggling off
      try {
        const history = await api("get", "/chats-history");
        setChats(history.data || []);
      } catch (error) {
        console.error("Failed to fetch chats:", error);
      }
    }
  };

  const filteredChats = searchQuery
    ? chats.filter((chat) =>
        chat.title?.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : chats;

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
          onClick={handleSearch}
          className="w-full justify-start gap-2 rounded-[8px] py-5 px-4 text-[14px]"
          variant="ghost"
        >
          <Search size={16} />
          Search chats
        </Button>
        <Button
          onClick={handleArchived}
          className="w-full justify-start gap-2 rounded-[8px] py-5 px-4 text-[14px]"
          variant="ghost"
        >
          <Archive size={16} />
          {showArchived ? "Back to chats" : "Archived chats"}
        </Button>

        {showSearch && (
          <input
            autoFocus
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search..."
            className="mx-2 mt-1 mb-2 px-3 py-2 rounded-[8px] bg-white/5 text-sm text-white/80 placeholder:text-white/30 border border-white/10 focus:outline-none focus:border-white/20"
          />
        )}

        <SidebarGroup>
          <SidebarGroupLabel>
            {showArchived ? "Archived Chats" : "Recent Chats"}
          </SidebarGroupLabel>
          <SidebarMenu>
            {filteredChats.map((chat) => (
              <ChatItem key={chat.chat_id} chat={chat} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-white/5 hover:bg-white/8 rounded-sm cursor-pointer">
        <UserDialog />
      </SidebarFooter>
    </Sidebar>
  );
}
