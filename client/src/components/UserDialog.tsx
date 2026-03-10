import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import UserInfo from "./UserInfo";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";

const UserDialog = () => {
  const navigate = useNavigate();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("user");
    navigate("/");
  };
  return (
    <Dialog>
      <DialogTrigger>
        <UserInfo />
      </DialogTrigger>

      <DialogContent className="w-[700px]! p-0">
        <div className="flex h-[500px] w-full">
          <Tabs
            defaultValue="general"
            orientation="vertical"
            className="flex w-full"
          >
            <TabsList className="w-45 border-r h-full flex-col justify-start items-start gap-1 rounded-none bg-transparent p-4">
              <TabsTrigger
                value="general"
                className="w-full justify-start px-3 py-2 rounded-sm data-[state=active]:bg-accent data-[state=active]:shadow-none"
              >
                General
              </TabsTrigger>
              <TabsTrigger
                value="appearance"
                className="w-full justify-start px-3 py-2 rounded-sm data-[state=active]:bg-accent data-[state=active]:shadow-none"
              >
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="data-controls"
                className="w-full justify-start px-3 py-2 rounded-sm data-[state=active]:bg-accent data-[state=active]:shadow-none"
              >
                Data Controls
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="w-full justify-start px-3 py-2 rounded-sm data-[state=active]:bg-accent data-[state=active]:shadow-none"
              >
                Security
              </TabsTrigger>
              <TabsTrigger
                value="about"
                className="w-full justify-start px-3 py-2 rounded-sm data-[state=active]:bg-accent data-[state=active]:shadow-none"
              >
                About
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-y-auto">
              <TabsContent value="general" className="mt-0 p-6 h-full">
                <h2 className="text-lg font-semibold mb-4">General</h2>
                <Separator className="mb-4" />
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium">Name</p>
                    <p className="text-sm text-muted-foreground">
                      Update your display name.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">
                      Your account email address.
                    </p>
                  </div>
                  <div>
                    <Button
                      className="font-medium text-destructive p-0 h-fit hover:bg-transparent!"
                      variant={"ghost"}
                      onClick={handleSignOut}
                    >
                      Log out
                    </Button>
                    <p className="text-[13px] text-muted-foreground">
                      Log out from your account.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium text-destructive">
                      Delete account
                    </p>
                    <p className="text-[13px] text-muted-foreground">
                      Permanently remove your account and all data.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="appearance" className="mt-0 p-6 h-full">
                <h2 className="text-lg font-semibold mb-4">Appearance</h2>
                <Separator className="mb-4" />
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium">Theme</p>
                    <p className="text-sm text-muted-foreground">
                      Choose between light and dark mode.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="data-controls" className="mt-0 p-6 h-full">
                <h2 className="text-lg font-semibold mb-4">Data Controls</h2>
                <Separator className="mb-4" />
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium">Chat history</p>
                    <p className="text-sm text-muted-foreground">
                      Manage how your chat history is stored.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Export data</p>
                    <p className="text-sm text-muted-foreground">
                      Download a copy of all your data.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="security" className="mt-0 p-6 h-full">
                <h2 className="text-lg font-semibold mb-4">Security</h2>
                <Separator className="mb-4" />
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">
                      Change your account password.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Two-factor authentication</p>
                    <p className="text-sm text-muted-foreground">
                      Add an extra layer of security to your account.
                    </p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="about" className="mt-0 p-6 h-full">
                <h2 className="text-lg font-semibold mb-4">About</h2>
                <Separator className="mb-4" />
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="font-medium">Version</p>
                    <p className="text-sm text-muted-foreground">1.0.0</p>
                  </div>
                  <div>
                    <p className="font-medium">Terms of Service</p>
                    <p className="text-sm text-muted-foreground">
                      Read our terms and conditions.
                    </p>
                  </div>
                  <div>
                    <p className="font-medium">Privacy Policy</p>
                    <p className="text-sm text-muted-foreground">
                      Learn how we handle your data.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserDialog;
