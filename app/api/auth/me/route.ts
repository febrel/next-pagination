import { NextResponse, NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ valid: false }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "fallback-secret-change-in-production",
    );

    const { payload } = await jwtVerify(token, secret);

    return NextResponse.json({
      valid: true,
      user: {
        id: payload.id,
        name: payload.name,
        user: payload.user,
      },
    });
  } catch {
    return NextResponse.json({ valid: false }, { status: 401 });
  }
}
