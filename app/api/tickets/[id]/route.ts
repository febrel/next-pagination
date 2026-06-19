import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ticketSchema } from "@/lib/schemas/ticket.shema";
import z from "zod";

interface Params {
  id: string;
}

export async function GET(_: any, { params }: { params: Promise<Params> }) {
  try {
    const { id } = await params;
    const result = await query(`SELECT * FROM ticket WHERE id = $1`, [id]);

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    return NextResponse.json({ ticket: result.rows[0] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, assigneer, status } = ticketSchema.parse(body);

    await query(
      `UPDATE ticket SET title = $1, description = $2, status = $3, assigneer = $4, "updatedAt" = NOW() WHERE id = $5`,
      [title, description, status, assigneer, id],
    );

    return NextResponse.json({ message: "Ticket update successfully" });
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(
  _: any,
  { params }: { params: Promise<Params> },
) {
  try {
    const { id } = await params;
    await query(`DELETE FROM ticket WHERE id = $1`, [id]);

    return NextResponse.json({ message: "Ticket deleted successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
