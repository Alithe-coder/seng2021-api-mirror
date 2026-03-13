
import 'dotenv/config';
console.log('DATABASE_URL:', process.env.DATABASE_URL);

import { PrismaClient } from "./generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: env("DATABASE_URL"),
});

export const prisma = new PrismaClient({ adapter });
