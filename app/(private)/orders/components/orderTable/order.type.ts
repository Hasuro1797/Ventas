import { IClient } from "@/app/(private)/clients/components/table/client.type";
import { IProduct } from "@/app/(private)/products/components/table/product.type";

export interface IOrder {
    id: number;
    clientId: number;
    total: number;
    date: string;
    details: IOrderDetail[];
    client: IClient;
}

export interface IOrderDetail {
    productId: number;
    product: IProduct;
    orderId: number;
    quantity: number;
    subtotal: number;
}
