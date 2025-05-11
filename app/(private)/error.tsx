"use client"; // Error boundaries must be Client Components

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="size-full flex flex-col gap-5 justify-center items-center">
      <div>
        <h2 className="text-2xl font-semibold text-blue-100 block">
          ¡Algo salió mal!
        </h2>
      </div>
      <div>
        <Button
          className="text-foreground"
          onClick={
            // Attempt to recover by trying to re-render the segment
            () => reset()
          }
        >
          Cargar de Nuevo
        </Button>
      </div>
    </div>
  );
}
