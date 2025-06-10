import { connectToMongoose } from "@/db/mongoose";
import { prisma } from "@/db/prisma";
import { authGuard } from "@/lib/auth/authGuard";
import { NextRequest } from "next/server";
import ClientInfo from "@/models/clientInfo";

export async function GET(request: NextRequest, { params }: { params: Promise<{id: string }>}) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  try {
    const { id } = await params;
    console.log("el contextparams es", id);
    console.log("el id es: ", id);
    await connectToMongoose();
    const client = await prisma.client.findUnique({
      where: {
        id: +id,
      },
    });
    if (!client) {
      return new Response(
        JSON.stringify({ error: "Cliente no encontrado" }),
        { status: 404 }
      );
    }
    const clientInfo = await ClientInfo.findOne({
      client_id: client.id,
    });
    return Response.json({
      ...client,
      ...(clientInfo && {
        clientInfo
      })
    }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al obtener el cliente" }),
      { status: 500 }
    );
  }
}