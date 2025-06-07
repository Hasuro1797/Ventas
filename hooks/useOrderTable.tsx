import { getAllOrders } from "@/actions/order-actions";
import { IOrder } from "@/app/(private)/orders/components/orderTable/order.type";
import { UseTableProps } from "@/types/api";
import { useCallback, useEffect, useState } from "react";

export function useOrderTable({
  page,
  pageSize,
  search,
  sort,
}: UseTableProps) {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const refecthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getAllOrders({
      page,
      pageSize,
      search,
      sort,
    });
    if (res.error) {
      setError(res.error);
      setOrders([]);
      setTotalPages(1);
    } else {
      setOrders(res.orders);
      setTotalPages(res.meta?.totalPages || 1);
      setTotal(res.meta?.total || 0);
    }

    setLoading(false);
  }, [page, pageSize, search, sort]);

  useEffect(() => {
    refecthData();
  }, [refecthData]);

  return {
    orders,
    totalPages,
    total,
    loading,
    error,
    refecthData,
  };
}
