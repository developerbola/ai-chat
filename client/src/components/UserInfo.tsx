import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useSessionStore from "@/store/sessionStore";
import { Button } from "./ui/button";

const UserInfo = () => {
  const { session } = useSessionStore();

  return (
    <div className="flex items-center justify-between px-1.5 cursor-pointer">
      <div className="flex items-center justify-center gap-2">
        <Avatar className="size-9">
          <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
          <AvatarFallback>
            {session?.user?.user_metadata?.name?.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col mt-[3px] max-w-[90px]">
          <span className="text-[13px] font-medium truncate">
            {session?.user?.user_metadata?.name ||
              session?.user?.user_metadata?.preferred_username ||
              session?.user?.email}
          </span>
          <p className="text-[12px] opacity-80 text-start">Free</p>
        </div>
      </div>
      <div>
        <Button
          variant={"outline"}
          className="rounded-full text-[11px] h-7"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default UserInfo;
