"use client";
import { Plus } from "lucide-react";
import FormReservation from "./FormClient";
import { ClientSchema } from "@/lib/zod";
import { useTransition } from "react";
import { createClientAction } from "@/actions/client-actions";
import { SuccessResponseClient } from "@/types/api";

export interface CreateoClientFormComponentProps {
  refetchData: () => Promise<void>;
}

export default function CreateClientFormComponent({
  refetchData,
}: CreateoClientFormComponentProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (
    values: ClientSchema
  ): Promise<{ error?: string; data?: SuccessResponseClient }> => {
    return await new Promise((resolve) => {
      startTransition(async () => {
        const { email, phone, name, clientInfo } = values;
        const res = await createClientAction({
          email,
          phone,
          name,
          ...(clientInfo && {
            clientInfo: {
              ...(clientInfo.comments &&
                clientInfo.comments.length > 0 && {
                  comments: clientInfo.comments,
                }),
              ...(clientInfo.preferences &&
                !Object.values(clientInfo.preferences).every(
                  (v) => v === undefined
                ) && {
                  preferences: {
                    ...(clientInfo.preferences?.language && {
                      language: clientInfo.preferences.language,
                    }),
                    ...(clientInfo.preferences?.paid_method && {
                      paid_method: clientInfo.preferences.paid_method,
                    }),
                    ...(clientInfo.preferences?.notifications && {
                      notifications: clientInfo.preferences.notifications,
                    }),
                  },
                }),
            },
          }),
        });
        resolve(res);
        await refetchData();
      });
    });
  };
  return (
    <div className="p-2">
      <FormReservation
        onSubmit={handleSubmit}
        isLoading={isPending}
        styles="flex gap-1"
      >
        <Plus className="!size-4" strokeWidth={2} />
        <span className="text-xs">Agregar</span>
      </FormReservation>
    </div>
  );
}
