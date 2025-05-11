"use client"
import React from "react";
import { CustomAvatarProps } from "./CustomAvatar.type";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export default function CustomAvatar({
  avatar,
  name,
  last_name,
  styleAvatar,
  styleFallback,
  styleImage,
}: CustomAvatarProps) {
  const createAvatarFallback = (
    name: string | undefined,
    last_name: string | undefined
  ) => {
    if (!name || !last_name) return "UD";
    return name.charAt(0).toUpperCase() + last_name.charAt(0).toUpperCase();
  };
  return (
    <Avatar className={styleAvatar}>
      <AvatarImage src={avatar} alt={name} className={styleImage}/>
      <AvatarFallback className={styleFallback}>
        {createAvatarFallback(name, last_name)}
      </AvatarFallback>
    </Avatar>
  );
}
