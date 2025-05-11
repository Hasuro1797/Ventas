import { ProductFormSchema, ProductSchema } from "@/lib/zod";

export async function createProductAction(data: ProductFormSchema) {
  try{
    const rest = await fetch(`/api/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al crear el producto",
      }
    }
    const dataResult = await rest.json();
    return {data: dataResult};
  } catch (error) {
    console.error("Error creating product:", error);
    return {error: "Error creating product"};
  }
}

export async function updateProductAction(data: ProductSchema) {
  try {
    const rest = await fetch(`/api/products`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al actualizar el producto",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error updated product, server error", error);
    return {error: "Error creating product, server error"};
  }
}

export async function getAllProducts({
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
    const rest = await fetch(`/api/products?page=${page}&pageSize=${pageSize}&search=${search}&sort=${sort}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al obtener los productos",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    return {
      error: "Error fetching products",
    }
  }
}

export async function deleteProductsAction(ids: number[]){
  try {
    const rest = await fetch(`/api/products`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al eliminar los productos",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error deleting products:", error);
    return {error: "Error deleting products"};
  }
}

export async function getProductById(id: number) {
  try {
    const rest = await fetch(`/api/products/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!rest.ok) {
      const errorResponse = await rest.json().catch(() => null);
      return {
        error: errorResponse?.error || "Error al obtener el producto",
      }
    }
    return await rest.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    return {error: "Error fetching product"};
  }
}
