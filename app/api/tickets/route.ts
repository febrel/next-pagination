import { NextResponse, NextRequest } from "next/server";
import { ticketSchema } from "@/lib/schemas/ticket.shema";
import prisma from "@/lib/db";
import z from "zod";
import { TicketStatus } from "@/app/tickets/tickets.interface";

// GET - ALL
// export async function GET() {
//   try {
//     const tickets = await prisma.ticket.findMany();
//     return NextResponse.json({ tickets });
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// GET - ALL PAGINATION
export async function GET(request: NextRequest) {
  try {
    const url = await request.url;

    const { searchParams } = new URL(url);

    // Captura params de url, si no pone por defecto
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 3);
    const status = searchParams.get("status") as TicketStatus | undefined;

    const count = await prisma.ticket.count({
      where: {
        status: status || undefined,
      },
    });
    const totalPages = Math.ceil(count / limit); // redondea pages:  3 / 2 = 2

    // Operacion para la pagination
    const tickets = await prisma.ticket.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: {
        status: status || undefined,
      },
    });

    return NextResponse.json({ tickets, totalPages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST - UPDATE
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validamos el cuerpo con Zod
    const { title, description, assigneer, status } = ticketSchema.parse(body);

    // Creamos el ticket en la base local
    const newTicket = await prisma.ticket.create({
      data: {
        title,
        description,
        assigneer,
        status,
      },
    });

    return NextResponse.json(
      {
        message: "Ticket created successfully",
      },
      { status: 201 },
    );
  } catch (err: any) {
    // Si el error es de validación de Zod
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }

    // Si es un error de base de datos u otro tipo
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
