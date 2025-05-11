import { LoaderCircle } from "lucide-react";
import React from "react";

export default function DashboardLoading() {
  return (
    <div className="w-full flex h-full items-center justify-center">
      <LoaderCircle className="w-8 h-8 text-primary animate-spin repeat-infinite" />
    </div>
  );
}
