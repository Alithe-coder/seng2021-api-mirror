
import 'dotenv/config';
console.log('DATABASE_URL:', process.env.DATABASE_URL);

import { PrismaClient } from "./generated/prisma/client.js";

import { PrismaPg } from "@prisma/adapter-pg";


const adapter = new PrismaPg({
  connectionString: "postgresql://neondb_owner:npg_QOSDKi63ZJUR@ep-falling-boat-a7x69krr-pooler.ap-southeast-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
});

export const prisma = new PrismaClient({ adapter });
