import { NextRequest } from "next/server";
import { authGuard } from "@/lib/auth/authGuard";
import { prisma } from "@/db/prisma";

export async function GET(request: NextRequest, { params }: {params: Promise<{ id: string }>}) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  try {
    const { id } = await params;
    const order = await prisma.order.findUnique({
      where: {
        id: +id,
      },
      include: {    
        details: {
          include: {
            product: true,
          }
        },
        client: true,
      },
    });
    if (!order) {
      return new Response(
        JSON.stringify({ error: "Orden no encontrada" }),
        { status: 404 }
      );
    }
    return Response.json({ order });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al obtener la Orden" }),
      { status: 500 }
    );
  }
}