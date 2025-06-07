"use client";
import { signOut, useSession } from "next-auth/react";
import { routes } from "@/lib/routes";
import {
  ChevronsUpDown,
  Loader,
  LogOut,
  MonitorCog,
  Moon,
  Sun,
} from "lucide-react";
import { CustomAvatar } from "../customAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  SidebarFooter,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { useTransition } from "react";
import { Button } from "../ui/button";
import { useTheme } from "next-themes";

// interface UserApi {
//   email: string;
//   id: string;
//   last_name: string;
//   name: string;
//   role: string;
//   avatar?: string;
// }
// interface CustomSideBarFooterProps {
//   user: UserApi;
// }
export default function CustomSideBarFooter() {
  const { data: session } = useSession();
  const [loading, startTransition] = useTransition();
  const { setTheme } = useTheme();
  const handleSignOut = async () => {
    startTransition(() => {
      signOut({
        callbackUrl: routes.signin,
      });
    });
  };
  return (
    <SidebarFooter>
      <ul>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton
                size={"lg"}
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-0"
              >
                <CustomAvatar
                  styleAvatar="h-8 w-8 rounded-lg dark:text-foreground text-foreground"
                  styleFallback="rounded-lg dark:text-foreground text-foreground"
                />
                <div className="grid flex-1 text-left dark:text-foreground text-foreground text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {session?.user.email}
                  </span>
                </div>
                <ChevronsUpDown className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-[--radix-dropdown-menu-trigger-width] dark:bg-background bg-white min-w-56 rounded-lg"
              side="bottom"
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                  <CustomAvatar
                    styleAvatar="h-8 w-8 rounded-lg dark:text-foreground text-foreground"
                    styleFallback="rounded-lg dark:text-foreground text-foreground"
                  />
                  <div className="grid flex-1 text-left dark:text-foreground text-foreground text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuSeparator />
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center justify-end gap-2 px-1 py-1.5">
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => setTheme("system")}
                  >
                    <MonitorCog className="size-4 text-foreground" />
                  </Button>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    onClick={() => setTheme("light")}
                  >
                    <Sun className="size-4 text-foreground" />
                  </Button>
                  <Button
                    variant={"ghost"}
                    size={"icon"}
                    className="!p-2"
                    onClick={() => setTheme("dark")}
                  >
                    <Moon className="size-4 text-foreground" />
                  </Button>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-wrong-foreground hover:!text-red-600"
              >
                {loading ? <Loader /> : <LogOut />}
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </ul>
    </SidebarFooter>
  );
}
