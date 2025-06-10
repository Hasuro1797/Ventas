import { prisma } from "@/db/prisma";
import { authGuard } from "@/lib/auth/authGuard";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest, { params }: {params: Promise<{ id: string }>}) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  try {
    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: {
        id: +id,
        active: true,
      },
    });
    if (!product) {
      return new Response(
        JSON.stringify({ error: "Producto no encontrado" }),
        { status: 404 }
      );
    }
    return Response.json(product, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al obtener el cliente" }),
      { status: 500 }
    );
  }
}