/* eslint-disable @next/next/no-img-element */
"use client";
import Link from "next/link";
import { CustomSideBarGroup } from "./customSideBar";
import CustomSideBarFooter from "./customSideBar/CustomSideBarFooter";
import { Sidebar, SidebarContent, SidebarHeader } from "./ui/sidebar";
import { routes, platformRoutes } from "@/lib/routes";
import { usePathname } from "next/navigation";

export default function AppSideBar() {
  // const { data, loading } = useQuery(GET_USER);
  const pathname = usePathname();
  return (
    <Sidebar>
      <SidebarHeader>
        <Link href={routes.home} className="max-w-max pl-2">
          <img
            alt="Logo"
            src={"/logo_dark.svg"}
            className="dark:invert"
            width={50}
            height={50}
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <CustomSideBarGroup
          routes={platformRoutes}
          sidebarLabel={"Plataforma"}
          currentPath={pathname}
        />
      </SidebarContent>
      <CustomSideBarFooter />
    </Sidebar>
  );
}
