const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const hash = await bcrypt.hash("admin123", 10);
  const user = await prisma.user.upsert({
    where: { email: "admin@slientnature.com" },
    update: {},
    create: { email: "admin@slientnature.com", username: "admin", password: hash, role: "ADMIN" }
  });
  console.log("Created admin:", user.email);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
