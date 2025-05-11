"use client";
import { useDebouncedCallback } from "use-debounce";
import { Input } from "../ui/input";
import { useState } from "react";

export default function SearchDebounce({
  initialValue,
  onSearch,
  debounceTime = 600,
  ...props
}: {
  initialValue: string;
  onSearch: (value: string) => void;
  debounceTime?: number;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange">) {
  const [value, setValue] = useState(initialValue);
  const debounce = useDebouncedCallback(
    (value) => {
      setValue(value);
      onSearch(value);
    },
    debounceTime
  );
  return (
    <Input
      {...props}
      defaultValue={value}
      onChange={(e) => debounce(e.target.value)}
    />
  );
}
