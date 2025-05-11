import { getClientById, updateClientAction } from "@/actions/client-actions";
import { IClient } from "@/app/(private)/clients/components/table/client.type";
import { UpdateClientSchema } from "@/lib/zod";
import { SuccessResponseClient } from "@/types/api";
import { useCallback, useState } from "react";

export function useClient(id: number) {
  const [data, setData] = useState<IClient | undefined>(undefined);
  const [updatedData, setUpdatedData] = useState<
    SuccessResponseClient | undefined
  >(undefined);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | undefined>(undefined);

  const getClient = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    const res = await getClientById(id);
    if (res.error) {
      setError(res.error);
      setData(undefined);
    } else {
      setData(res);
    }

    setLoading(false);
  }, [id]);

  const updateClient = useCallback(async (data: UpdateClientSchema) => {
    setUpdating(true);
    setError(undefined);
    const res = await updateClientAction(data);
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
    getClient,
    updateClient,
  };
}
