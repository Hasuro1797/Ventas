"use client";
import Link from "next/link";

// import { useMediaQuery } from "@uidotdev/usehooks";
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Fragment, useState } from "react";
import { CustomBreadCrumbProps } from "./CustomBreadCrumb.type";

const ITEMS_TO_DISPLAY = 3;

export const CustomBreadCrumb = ({ pathname }: CustomBreadCrumbProps) => {
  const pathNameArr = pathname.split("/").filter((path) => path);
  const pathNameList = pathNameArr.map((path, index) => {
    const label = path
      .split("-")
      .join(" ")
      .replace(/^\w/, (c) => c.toUpperCase());
    if (index + 1 === pathNameArr.length) return { label };
    return { href: `/${path}`, label };
  });
  const PATHS_RIGHT_NUMBER = pathNameList.length === 2 ? 2 : 1; 

  // const pathNameList = items;

  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          {pathNameList?.[0]?.href ? (
            <BreadcrumbLink asChild className="max-w-20 truncate md:max-w-none">
              <Link href={pathNameList[0].href}>{pathNameList[0].label}</Link>
            </BreadcrumbLink>
          ) : (
            <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
              {pathNameList?.[0]?.label || ""}
            </BreadcrumbPage>
          )}
        </BreadcrumbItem>
        {pathNameList.length <= ITEMS_TO_DISPLAY && pathNameList.length > 1 && (
          <BreadcrumbSeparator />
        )}
        {pathNameList.length > ITEMS_TO_DISPLAY && (
          <Fragment>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              {isDesktop ? (
                <DropdownMenu>
                  <DropdownMenuTrigger
                    className="flex item-center gap-1 focus:outline-none"
                    aria-label="Toggle menu"
                  >
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    {pathNameList.slice(1, -2).map((item, index) => {
                      return (
                        <DropdownMenuItem key={index}>
                          <Link href={item.href || "#"}>{item.label}</Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Drawer open={open} onOpenChange={setOpen}>
                  <DrawerTrigger aria-label="Toggle Menu">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                  </DrawerTrigger>
                  <DrawerContent>
                    <DrawerHeader>
                      <DrawerTitle className="">Navegar a:</DrawerTitle>
                      <DrawerDescription className="">
                        Selecciona una página para navegar
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="grid gap-1 px-4">
                      {pathNameList.slice(1, -2).map((item, index) => {
                        return (
                          <Link
                            href={item.href || "#"}
                            key={index}
                            className="py-1 text-sm"
                          >
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                    <DrawerFooter className="pt-4">
                      <DrawerClose asChild>
                        <Button variant="outline">Close</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              )}
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        )}
        {pathNameList.length > 1 && (
          <Fragment>
            {pathNameList.slice(-ITEMS_TO_DISPLAY + PATHS_RIGHT_NUMBER).map((item, index) => {
              return (
                <Fragment key={index}>
                  <BreadcrumbItem>
                    {item.href ? (
                      <Fragment>
                        <BreadcrumbLink
                          asChild
                          className="max-w-20 truncate md:max-w-none"
                        >
                          <Link href={item.href}>{item.label}</Link>
                        </BreadcrumbLink>
                      </Fragment>
                    ) : (
                      <BreadcrumbPage className="max-w-20 truncate md:max-w-none">
                        {item.label}
                      </BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index + 1 !==
                    pathNameList.slice(-ITEMS_TO_DISPLAY + PATHS_RIGHT_NUMBER).length && (
                    <BreadcrumbSeparator />
                  )}
                </Fragment>
              );
            })}
          </Fragment>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
