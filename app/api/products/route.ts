import { prisma } from "@/db/prisma";
import { authGuard } from "@/lib/auth/authGuard";
import { productFormSchema, productSchema } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const sort = searchParams.get("sort") || "createdAt-desc";
  const search = searchParams.get("search")?.trim() || "";

  try{
    const regex = /^[a-zA-Z]+-(ASC|DESC|asc|desc)$/;
    if (!regex.test(sort)) {
      return new Response(
        JSON.stringify({ error: "Invalid sort parameter" }),
        { status: 400 }
      );
    }
    const [sortField, sortOrder] = sort.split("-");

    const where: Prisma.ProductWhereInput = {
      OR:search ? [
        { name: { contains: search, mode: "insensitive" } },
      ]: undefined,
      active: true,
    };
    const orderBy: Prisma.ProductOrderByWithRelationInput = {
      [sortField]: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
    };

    const total = await prisma.product.count({ where });

    const products = await prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return Response.json({
      products,
      meta: {
        page,
        total,
        totalPages: Math.ceil(total / pageSize),
      }
    });
  }catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error en el servidor" }),
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  try{
    const body = await request.json();
    const {success, data, error} = productFormSchema.safeParse(body);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Invalid data", description: error.message}),
        { status: 400 }
      );
    }
      
    const product = await prisma.product.create({
      data: {
        ...data,
      }
    });
    return Response.json({message: "Porducto creado correctamente", product},{status: 201});
  }catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al crear el Producto" }),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  try {
    const body = await request.json();
    const { success, data } = productSchema.safeParse(body);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Invalid data", issues: data }),
        { status: 400 }
      );
    }

    const { id, ...rest } = data;

    await prisma.product.update({
      where: { id },
      data: {
        ...rest,
      },
    });
    
    return Response.json({ message: "Producto actualizado correctamente" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar el producto" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  try {
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid data" }),
        { status: 400 }
      );
    }

    await prisma.product.updateMany({
      where: {
        id: { in: ids },
      },
      data: {
        active: false,
      },
    });

    return Response.json({ message: "Producto(s) eliminado(s) correctamente" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar el producto, o problemas en el servidor" }),
      { status: 500 }
    );
  }
}