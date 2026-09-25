// Usage: node scripts/add-navigator.mjs you@khada.xyz "Your Name"
import { PrismaClient } from "@prisma/client";
const [email, ...nameParts] = process.argv.slice(2);
if (!email) { console.error('Usage: node scripts/add-navigator.mjs email "Name"'); process.exit(1); }
const db = new PrismaClient();
const nav = await db.navigator.upsert({
  where: { email: email.toLowerCase() },
  create: { email: email.toLowerCase(), name: nameParts.join(" ") || email },
  update: { active: true, ...(nameParts.length ? { name: nameParts.join(" ") } : {}) },
});
console.log("Navigator ready:", nav.email, "-", nav.name);
await db.$disconnect();
