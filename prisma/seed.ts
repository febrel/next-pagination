import { PrismaClient } from "../app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@admin.com" },
    update: {},
    create: {
      name: "Administrator",
      user: "admin",
      email: "admin@admin.com",
      password: hashedPassword,
    },
  });

  console.log(`Admin user created: ${admin.user} (${admin.email})`);

  const updated = await prisma.ticket.updateMany({
    where: { userId: null },
    data: { userId: admin.id },
  });

  console.log(`${updated.count} tickets assigned to admin`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
