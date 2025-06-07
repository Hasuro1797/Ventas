import { IClient } from "@/app/(private)/clients/components/table/client.type";

interface SuccessResponse{
  message: string;
}

interface SuccessResponseClient extends SuccessResponse{
  client: IClient;
}


interface ErrorResponseClient {
  error: string;
}

interface AllClientsResponse{
  clients: IClient[];
  meta: {
    page: number;
    total: number;
    totalPages: number;
  };
}

interface UseTableProps {
  page: number;
  pageSize: number;
  search: string;
  sort: string;
}

interface OrderItem {
  productId: number
  productName: string
  price: number
  quantity: number
  subtotal: number
}