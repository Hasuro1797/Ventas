"use client";
import React from "react";
import { CustomAvatarProps } from "./CustomAvatar.type";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { User } from "lucide-react";

export default function CustomAvatar({
  styleAvatar,
  styleFallback,
}: CustomAvatarProps) {
  return (
    <Avatar className={styleAvatar}>
      <AvatarFallback className={styleFallback}>
        <User className="h-4 w-4" />
      </AvatarFallback>
    </Avatar>
  );
}
