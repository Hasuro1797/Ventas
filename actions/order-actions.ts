import {SendOrderSchema} from "@/lib/zod";

export async function createOrderAction(data: SendOrderSchema) {
  try{
    const rest = await fetch(`/api/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al crear la orden",
      }
    }
    const dataResult = await rest.json();
    return {data: dataResult};
  } catch (error) {
    console.error("Error creating order:", error);
    return {error: "Error creating order"};
  }
}

export async function getAllOrders({
  page,
  pageSize,
  search,
  sort
}:{
  page: number;
  pageSize: number;
  search: string;
  sort: string;
}) {
  try {
    const rest = await fetch(`/api/orders?page=${page}&pageSize=${pageSize}&search=${search}&sort=${sort}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al obtener las ordenes",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      error: "Error fetching orders",
    }
  }
}

export async function deleteOrdersAction(ids: number[]){
  try {
    const rest = await fetch(`/api/orders`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al eliminar las ordenes",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error deleting orders:", error);
    return {error: "Error deleting orders"};
  }
}

export async function getOrderById(id: number) {
  try {
    const rest = await fetch(`/api/orders/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al obtener la orden",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error fetching order:", error);
    return {error: "Error fetching order"};
  }
}
