"use client";
import { ChevronsUpDown, Loader, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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
import { routes } from "@/lib/routes";

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
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      // await signOut();
      router.push(routes.signin);
    } catch (error) {
      console.error(error);
      toast.error("Error al cerrar sesión", {
        description: "Por favor, inténtelo de nuevo",
        classNames: {
          toast: "bg-background",
          icon: "text-red-500",
          title: "text-foreground",
          description: "text-foreground",
        },
      });
    }
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
                {/* <CustomAvatar
                  avatar={user?.avatar}
                  name={user?.name}
                  last_name={user?.last_name}
                  styleAvatar="h-8 w-8 rounded-lg dark:text-foreground text-foreground"
                  styleFallback="rounded-lg dark:text-foreground text-foreground"
                /> */}
                <div className="grid flex-1 text-left dark:text-foreground text-foreground text-sm leading-tight">
                  {/* <span className="truncate font-semibold">{user?.name}</span>
                  <span className="truncate text-xs">{user?.email}</span> */}
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
                  {/* <CustomAvatar
                    avatar={user?.avatar}
                    name={user?.name}
                    last_name={user?.last_name}
                    styleAvatar="h-8 w-8 rounded-lg dark:text-foreground text-foreground"
                    styleFallback="rounded-lg dark:text-foreground text-foreground"
                  /> */}
                  <div className="grid flex-1 text-left dark:text-foreground text-foreground text-sm leading-tight">
                    {/* <span className="truncate font-semibold">{user?.name}</span>
                    <span className="truncate text-xs">{user?.email}</span> */}
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleSignOut}
                className="text-wrong-foreground hover:!text-wrong-foreground"
              >
                {/* {signOutLoading ? (
                  <Loader className="animate-spin repeat-infinite" />
                ) : (
                  <LogOut />
                )} */}
                Cerrar sesión
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </ul>
    </SidebarFooter>
  );
}
