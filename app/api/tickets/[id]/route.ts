import prisma from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import { ticketSchema } from "@/lib/schemas/ticket.shema";
import z from "zod";

interface Params {
  id: string;
}

// GET - ID
export async function GET(_: any, { params }: { params: Promise<Params> }) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.findFirst({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ ticket });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// PUT
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    // Validamos el cuerpo con Zod
    const { title, description, assigneer, status } = ticketSchema.parse(body);

    const ticket = await prisma.ticket.update({
      data: {
        title,
        description,
        assigneer,
        status,
      },
      where: {
        id: id,
      },
    });

    return NextResponse.json({ ticket });
  } catch (err: any) {
    // Si el error es de validación de Zod
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE
export async function DELETE(_: any, { params }: { params: Promise<Params> }) {
  try {
    const { id } = await params;
    const ticket = await prisma.ticket.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
