import { NextResponse, NextRequest } from "next/server";
import { query } from "@/lib/db";
import { ticketSchema } from "@/lib/schemas/ticket.shema";
import z from "zod";
import { TicketStatus } from "@/app/tickets/tickets.interface";

export async function GET(request: NextRequest) {
  try {
    const url = await request.url;
    const { searchParams } = new URL(url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 3);
    const status = searchParams.get("status") as TicketStatus | undefined;
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const countResult = await query(
      `SELECT COUNT(*) FROM ticket WHERE "userId" = $1 AND ($2::text IS NULL OR status = $2)`,
      [userId, status || null],
    );
    const total = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(total / limit);

    const ticketsResult = await query(
      `SELECT * FROM ticket WHERE "userId" = $1 AND ($2::text IS NULL OR status = $2) ORDER BY "createdAt" DESC LIMIT $3 OFFSET $4`,
      [userId, status || null, limit, (page - 1) * limit],
    );

    return NextResponse.json({ tickets: ticketsResult.rows, totalPages });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, assigneer, status } = ticketSchema.parse(body);

    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { jwtVerify } = await import("jose");
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
    );
    const { payload } = await jwtVerify(token, secret);

    await query(
      `INSERT INTO ticket (id, title, description, status, assigneer, "userId", "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, $5, NOW())`,
      [title, description, status, assigneer, payload.id],
    );

    return NextResponse.json(
      { message: "Ticket created successfully" },
      { status: 201 },
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
