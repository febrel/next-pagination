import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import bcrypt from "bcryptjs";

export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || "Administrator";
    const adminUser = process.env.ADMIN_USER || "admin";

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "ADMIN_EMAIL and ADMIN_PASSWORD env vars required" },
        { status: 400 },
      );
    }

    const existing = await query(
      `SELECT id FROM "user" WHERE email = $1 LIMIT 1`,
      [adminEmail],
    );

    if (existing.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      await query(
        `INSERT INTO "user" (id, name, "user", email, password, "updatedAt") VALUES (gen_random_uuid()::text, $1, $2, $3, $4, NOW())`,
        [adminName, adminUser, adminEmail, hashedPassword],
      );
    }

    const adminResult = await query(
      `SELECT id FROM "user" WHERE email = $1 LIMIT 1`,
      [adminEmail],
    );
    const adminId = adminResult.rows[0].id;

    const updateResult = await query(
      `UPDATE ticket SET "userId" = $1 WHERE "userId" IS NULL`,
      [adminId],
    );

    return NextResponse.json({
      message: "Database seeded successfully",
      ticketsAssigned: updateResult.rowCount,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
