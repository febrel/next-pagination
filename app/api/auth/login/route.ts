import { NextResponse, NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import prisma from "@/lib/db";
import z from "zod";

const loginSchema = z.object({
  user: z.string().min(1, "User is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { user, password } = loginSchema.parse(body);

    const userFound = await prisma.user.findFirst({
      where: { user },
    });

    if (!userFound) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const passwordMatch = await bcrypt.compare(password, userFound.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
    );

    const token = await new SignJWT({
      id: userFound.id,
      user: userFound.user,
      name: userFound.name,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(secret);

    const response = NextResponse.json({
      user: {
        id: userFound.id,
        name: userFound.name,
        user: userFound.user,
      },
    });

    response.cookies.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (err: any) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: err.issues }, { status: 400 });
    }
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
