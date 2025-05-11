// "use client";
import Link from "next/link";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../ui/sidebar";
import { CustomSideBarGroupProps } from "./CustomSideBarGroup.type";
export default function CustomSideBarGroup({
  routes,
  sidebarLabel = "",
  currentPath,
}: {
  routes: CustomSideBarGroupProps[];
  sidebarLabel?: string;
  currentPath: string;
}) {
  return (
    <SidebarGroup>
      {sidebarLabel && <SidebarGroupLabel>{sidebarLabel}</SidebarGroupLabel>}
      <SidebarMenu>
        {routes.map((item) => {
          return (
            <SidebarMenuItem key={item.id}>
              {
                <SidebarMenuButton asChild isActive={currentPath === item.href}>
                  <Link href={item.href}>
                    {item.icon && (
                      <item.icon className="w-5 h-5" strokeWidth={1} />
                    )}
                    <span>{item.groupLabel}</span>
                  </Link>
                </SidebarMenuButton>
              }
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
