import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { query } from "@/lib/db";
import z from "zod";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  user: z.string().min(1, "User is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, user, email, password } = registerSchema.parse(body);

    const existingEmail = await query(
      `SELECT id FROM "user" WHERE email = $1 LIMIT 1`,
      [email],
    );

    if (existingEmail.rows.length > 0) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO "user" (id, name, "user", email, password, "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW())`,
      [name, user, email, hashedPassword],
    );

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 },
    );
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: err.issues.map((i) => i.message).join(", ") },
        { status: 400 },
      );
    }

    if (err.code === "23505") {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
