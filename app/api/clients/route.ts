import { connectToMongoose } from "@/db/mongoose";
import { prisma } from "@/db/prisma";
import { authGuard } from "@/lib/auth/authGuard";
import { serverFormSchema, updateClientSchema } from "@/lib/zod";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import ClientInfo from "@/models/clientInfo";

export async function GET(request: NextRequest) {
  const token = await authGuard(request);
  if (token instanceof Response) {
    return token;
  }
  const { searchParams } = new URL(request.url);

  const page = parseInt(searchParams.get("page") || "1");
  const pageSize = parseInt(searchParams.get("pageSize") || "10");
  const sort = searchParams.get("sort") || "registeredAt-desc";
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

    const where: Prisma.ClientWhereInput = {
      OR:search ? [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ]: undefined,
    };
    const orderBy: Prisma.ClientOrderByWithRelationInput = {
      [sortField]: sortOrder.toLowerCase() === "asc" ? "asc" : "desc",
    };

    const total = await prisma.client.count({ where });

    const clients = await prisma.client.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    return Response.json({
      clients,
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
    const {success, data, error} = serverFormSchema.safeParse(body);
    if (!success) {
      return new Response(
        JSON.stringify({ error: "Invalid data", description: error.message}),
        { status: 400 }
      );
    }
  
    const {email, name, phone, clientInfo } = data;
  
    await connectToMongoose();
    
    const clientFound = await prisma.client.findUnique({
      where: {
        email
      }
    });

    if (clientFound) {
      return new Response(
        JSON.stringify({ error: "El cliente ya existe con ese correo electrónico" }),
        { status: 400 }
      );
    }
    const client = await prisma.client.create({
      data: {
        email,
        name,
        phone
      }
    });
    if (clientInfo) {
      await ClientInfo.create({
          client_id: client.id,
          ...(clientInfo.comments && {comments: clientInfo.comments}),
          ...(clientInfo.preferences && {
            preferences: {
              ...(clientInfo.preferences.language && {language: clientInfo.preferences.language}),
              ...(clientInfo.preferences.paid_method && {paid_method: clientInfo.preferences.paid_method}),
              ...(clientInfo.preferences.notifications && {notifications: clientInfo.preferences.notifications})
            }
          }),
        })
    }
    return Response.json({message: "Cliente creado correctamente", client},{status: 201});
  }catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al crear el cliente" }),
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
    const { success, data } = updateClientSchema.safeParse(body);

    if (!success) {
      return new Response(
        JSON.stringify({ error: "Invalid data", issues: data }),
        { status: 400 }
      );
    }

    const { id, email, name, phone, clientInfo } = data;
    await connectToMongoose();

    await prisma.client.update({
      where: { id },
      data: {
        ...email && { email },
        ...name && { name },
        ...phone && { phone },
      },
    });
    if (clientInfo) {
      const clientInfoFound = await ClientInfo.findOne({
        client_id: id,
      });

      if (!clientInfoFound) {
        await ClientInfo.create({
          client_id: id,
          ...(clientInfo.comments && { comments: clientInfo.comments }),
          ...(clientInfo.preferences && {
            preferences: {
              ...(clientInfo.preferences.language && { language: clientInfo.preferences.language }),
              ...(clientInfo.preferences.paid_method && { paid_method: clientInfo.preferences.paid_method }),
              ...(clientInfo.preferences.notifications && { notifications: clientInfo.preferences.notifications })
            }
          }),
        });
      }else{
        await ClientInfo.updateOne(
          { client_id: id },
          {
            ...(clientInfo.comments && { comments: clientInfo.comments }),
            ...(clientInfo.preferences && {
              preferences: {
                ...(clientInfo.preferences.language && { language: clientInfo.preferences.language }),
                ...(clientInfo.preferences.paid_method && { paid_method: clientInfo.preferences.paid_method }),
                ...(clientInfo.preferences.notifications && { notifications: clientInfo.preferences.notifications })
              }
            }),
          }
        );
      }
      
    }
    return Response.json({ message: "Cliente actualizado correctamente" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al actualizar el cliente" }),
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

    await connectToMongoose();

    await prisma.client.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    await ClientInfo.deleteMany({
      client_id: { $in: ids },
    });
    return Response.json({ message: "Cliente(s) eliminado(s) correctamente" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al eliminar el cliente, o problemas en el servidor" }),
      { status: 500 }
    );
  }
}