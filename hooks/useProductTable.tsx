import { getAllProducts } from "@/actions/product-actions";
import { IProduct } from "@/app/(private)/products/components/table/product.type";
import { UseTableProps } from "@/types/api";
import { useCallback, useEffect, useState } from "react";

export function useProductsTable({
  page,
  pageSize,
  search,
  sort,
}: UseTableProps) {
  const [clients, setClients] = useState<IProduct[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const refecthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getAllProducts({
      page,
      pageSize,
      search,
      sort,
    });
    if (res.error) {
      setError(res.error);
      setClients([]);
      setTotalPages(1);
    } else {
      setClients(res.products);
      setTotalPages(res.meta?.totalPages || 1);
      setTotal(res.meta?.total || 0);
    }

    setLoading(false);
  }, [page, pageSize, search, sort]);

  useEffect(() => {
    refecthData();
  }, [refecthData]);

  return {
    clients,
    totalPages,
    total,
    loading,
    error,
    refecthData,
  };
}
