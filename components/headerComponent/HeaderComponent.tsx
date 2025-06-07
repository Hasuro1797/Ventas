"use client";
import { usePathname } from "next/navigation";
import React from "react";
import { SidebarTrigger } from "../ui/sidebar";
import { Separator } from "../ui/separator";
import { CustomBreadCrumb } from "../customBreadCrumb";

export default function HeaderComponent() {
  const paths = usePathname();
  return (
    <header className="h-14 flex px-4 gap-4 items-center w-full">
      <SidebarTrigger />
      <Separator orientation="vertical" className="!h-4" />
      <CustomBreadCrumb pathname={paths} />
    </header>
  );
}
