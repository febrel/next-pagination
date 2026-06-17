// import { PrismaClient } from "@/app/generated/prisma";

// lib/prisma.ts (o lib/db.ts)
import { PrismaClient } from "@/app/generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

// 1. Creamos el pool de conexiones hacia tu Postgres Local
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);

const prismaClientSingleton = () => {
  // 2. LE PASAMOS EL ADAPTADOR EXPLÍCITAMENTE AL CONSTRUCTOR
  return new PrismaClient({ adapter });
};

interface CustomGlobal {
  prismaGlobal?: ReturnType<typeof prismaClientSingleton>;
}

const globalForPrisma = globalThis as unknown as CustomGlobal;

export const prisma = globalForPrisma.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prismaGlobal = prisma;
}
