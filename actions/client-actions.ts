import {ClientSchema, UpdateClientSchema} from "@/lib/zod";

export async function createClientAction(data: ClientSchema) {
  try{
    const rest = await fetch(`/api/clients`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al crear el cliente",
      }
    }
    const dataResult = await rest.json();
    return {data: dataResult};
  } catch (error) {
    console.error("Error creating client:", error);
    return {error: "Error creating client"};
  }
}

export async function updateClientAction(data: UpdateClientSchema) {
  try {
    const rest = await fetch(`/api/clients`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al actualizar el cliente",
      }
    }
    // revalidatePath("/clients");
    return await rest.json();
  } catch (error) {
    console.error("Error updated client, server error", error);
    return {error: "Error creating client, server error"};
  }
}

export async function getAllClients({
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
    const rest = await fetch(`/api/clients?page=${page}&pageSize=${pageSize}&search=${search}&sort=${sort}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al obtener los clientes",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error fetching clients:", error);
    return {
      error: "Error fetching clients",
    }
  }
}

export async function deleteClientsAction(ids: number[]){
  try {
    const rest = await fetch(`/api/clients`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al eliminar los clientes",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error deleting clients:", error);
    return {error: "Error deleting clients"};
  }
}

export async function getClientById(id: number) {
  try {
    const rest = await fetch(`/api/clients/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al obtener el cliente",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error fetching client:", error);
    return {error: "Error fetching client"};
  }
}