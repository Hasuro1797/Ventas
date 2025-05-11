"use client";
import { createProductAction } from "@/actions/product-actions";
import { ProductFormSchema } from "@/lib/zod";
import { SuccessResponseClient } from "@/types/api";
import { Plus } from "lucide-react";
import { useTransition } from "react";
import FormProduct from "./FormProduct";

export interface CreateProductFormComponentProps {
  refetchData: () => Promise<void>;
}

export default function CreateProductFormComponent({
  refetchData,
}: CreateProductFormComponentProps) {
  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (
    values: ProductFormSchema
  ): Promise<{ error?: string; data?: SuccessResponseClient }> => {
    return await new Promise((resolve) => {
      startTransition(async () => {
        const res = await createProductAction({
          ...values,
        });
        resolve(res);
        await refetchData();
      });
    });
  };
  return (
    <div className="p-2">
      <FormProduct
        onSubmit={handleSubmit}
        isLoading={isPending}
        styles="flex gap-1"
      >
        <Plus className="!size-4" strokeWidth={2} />
        <span className="text-xs">Agregar</span>
      </FormProduct>
    </div>
  );
}
