"use client";
import { useProduct } from "@/hooks/use-product";
import { ProductFormSchema } from "@/lib/zod";
import { SuccessResponseClient } from "@/types/api";
import { LoaderCircle, PenLine } from "lucide-react";
import { toast } from "sonner";
import FormClient from "../FormProduct";

export interface EditProductProps {
  idProduct: number;
  refechProducts: () => Promise<void>;
}

export default function EditProduct({
  idProduct,
  refechProducts,
}: EditProductProps) {
  const {
    data,
    loading,
    updating,
    getProduct,
    error,
    updateProduct,
    updatedData,
  } = useProduct(idProduct);

  const handleSubmit = async (
    values: ProductFormSchema
  ): Promise<{ error?: string; data?: SuccessResponseClient }> => {
    await updateProduct({
      id: idProduct,
      ...values,
    });
    await refechProducts();
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
  };
  const handleGetProductById = async () => {
    await getProduct();
    if (error) {
      console.error(error);
      toast.error("Error al cargar un producto", {
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
      getInfoBeforeToShow={handleGetProductById}
      initialData={data}
      mode="edit"
      isLoading={updating}
      onSubmit={handleSubmit}
      title="Editar"
      styles="flex mx-auto h-8 w-8 p-0"
      variant="ghost"
    >
      <span className="sr-only">Editar Producto</span>
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
