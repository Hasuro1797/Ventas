"use client";
import { ClientSchema } from "@/lib/zod";
import { LoaderCircle, PenLine } from "lucide-react";
import { useClient } from "@/hooks/use-client";
import { SuccessResponseClient } from "@/types/api";
import { toast } from "sonner";
import FormClient from "../FormClient";

export interface EditClientProps {
  idClient: number;
  refechAllClient: () => Promise<void>;
}

export default function EditClient({
  idClient,
  refechAllClient,
}: EditClientProps) {
  const {
    data,
    loading,
    updating,
    getClient,
    error,
    updateClient,
    updatedData,
  } = useClient(idClient);

  const handleSubmit = async (
    values: ClientSchema
  ): Promise<{ error?: string; data?: SuccessResponseClient }> => {
    const { email, phone, name, clientInfo } = values;
    await updateClient({
      id: idClient,
      email,
      phone,
      name,
      ...(clientInfo && {
        clientInfo: {
          ...(clientInfo.comments && {
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
    await refechAllClient();
    if (updatedData) {
      return {
        error: undefined,
        data: updatedData,
      };
    } else {
      return {
        error,
        data: undefined,
      };
    }

    // const mediaIds = values.media.map((media) => media.id);
    // try {
    //   await updateReservation({
    //     variables: {
    //       updateReservationInput: {
    //         description: values.description,
    //         idProduct: values.idProduct,
    //         price: values.price,
    //         stock: values.stock,
    //         title: values.title,
    //         mediaIds,
    //         id: idReservation,
    //       },
    //     },
    //   });
    //   await refetch();
    //   await refechAllReservations();
    // } catch (e) {
    //   console.error(e);
    //   toast.error("Error al actualizar un cliente", {
    //     classNames: {
    //       toast: "bg-background",
    //       icon: "text-red-500",
    //       title: "text-foreground",
    //       description: "text-foreground",
    //     },
    //   });
    // }
  };
  const handleGetReservationById = async () => {
    await getClient();
    if (error) {
      console.error(error);
      toast.error("Error al cargar un cliente", {
        classNames: {
          toast: "bg-background",
          icon: "text-red-500",
          title: "text-foreground",
          description: "text-foreground",
        },
      });
    }
  };
  return (
    <FormClient
      getInfoBeforeToShow={handleGetReservationById}
      initialData={data}
      mode="edit"
      isLoading={updating}
      onSubmit={handleSubmit}
      title="Editar"
      styles="flex mx-auto h-8 w-8 p-0"
      variant="ghost"
    >
      <span className="sr-only">Editar Cliente</span>
      {loading ? (
        <LoaderCircle
          className="text-primary animate-spin repeat-infinite"
          strokeWidth={2}
        />
      ) : (
        <PenLine className="" strokeWidth={2} />
      )}
    </FormClient>
  );
}
