import { getProductById, updateProductAction } from "@/actions/product-actions";
import { IProduct } from "@/app/(private)/products/components/table/product.type";
import { ProductSchema } from "@/lib/zod";
import { SuccessResponseClient } from "@/types/api";
import { useCallback, useState } from "react";

export function useProduct(id: number) {
  const [data, setData] = useState<IProduct | undefined>(undefined);
  const [updatedData, setUpdatedData] = useState<
    SuccessResponseClient | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getProduct = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const res = await getProductById(id);
    if (res.error) {
      setError(res.error);
      setData(undefined);
    } else {
      setData(res);
    }

    setLoading(false);
  }, [id]);

  const updateProduct = useCallback(async (data: ProductSchema) => {
    setUpdating(true);
    setError(undefined);
    const res = await updateProductAction(data);
    if (res.error) {
      setError(res.error);
    } else {
      setUpdatedData(res);
    }
    setUpdating(false);
  }, []);

  return {
    data,
    loading,
    updating,
    updatedData,
    error,
    getProduct,
    updateProduct,
  };
}
