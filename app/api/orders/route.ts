import { NextRequest } from "next/server";
import { authGuard } from "@/lib/auth/authGuard";
import { Prisma } from "@prisma/client";
import { prisma } from "@/db/prisma";
import { sendOrderSchema } from "@/lib/zod";

export async function GET(request: NextRequest) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const sort = searchParams.get("sort") || "date-desc";
  const search = searchParams.get("search")?.trim() || "";
  try {
    const regex = /^[a-zA-Z]+-(ASC|DESC|asc|desc)$/;
    if (!regex.test(sort)) {
      return new Response(
        JSON.stringify({ error: "Invalid sort parameter" }),
        { status: 400 }
      );
    }
    const [sortField, sortOrder] = sort.split("-");
    const where: Prisma.OrderWhereInput = {
      client:{
        name: {
          contains: search,
          mode: "insensitive"
        },
      }
    }
    const orderBy: Prisma.OrderOrderByWithRelationInput = {
      [sortField]: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
    }
    const total = await prisma.order.count({ where });
    const orders = await prisma.order.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        client: true,
      }
    });
    return Response.json({ 
      orders,
      meta: {
        page,
        total,
        totalPages: Math.ceil(total / pageSize),
      }
    });
  } catch (error) {
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
    const {success, data, error} = sendOrderSchema.safeParse(body);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Invalid data", description: error.message}),
        { status: 400 }
      );
    }
    const order = await prisma.order.create({
      data: {
        clientId: data.clientId,
        total: data.total,
      }
    });
    await Promise.all(data.items.map(async (item) => {
      await prisma.orderDetail.create({
        data: {
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          subtotal: item.subtotal,
        }
      });
    }));
    await Promise.all(data.items.map(async (item) => {
      await prisma.product.update({
        where: {
          id: item.productId,
        },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }));
    return Response.json({message: "Orden creada correctamente", order},{status: 201});
  }catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al crear la Orden" }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  try{
    const body = await request.json();
    const { ids } = body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid data" }),
        { status: 400 }
      );
    }
    const order = await prisma.order.deleteMany({
      where: {
        id: {
          in: ids,
        },
      }
    });
    return Response.json({message: `Orden(es) eliminada(s) correctamente`, order},{status: 200});
  }catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar la Orden" }),
      { status: 500 }
    );
  }
}
