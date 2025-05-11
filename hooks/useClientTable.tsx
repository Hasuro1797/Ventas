import { getAllClients } from "@/actions/client-actions";
import { IClient } from "@/app/(private)/clients/components/table/client.type";
import { UseTableProps } from "@/types/api";
import { useCallback, useEffect, useState } from "react";

export function useClientsTable({
  page,
  pageSize,
  search,
  sort,
}: UseTableProps) {
  const [clients, setClients] = useState<IClient[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const refecthData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const res = await getAllClients({
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
      setClients(res.clients);
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
