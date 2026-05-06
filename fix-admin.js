const bcrypt = require("bcryptjs");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
async function main() {
  const user = await prisma.user.update({
    where: { email: "admin@slientnature.com" },
    data: { role: "admin" }
  });
  console.log("Updated admin role:", user.email, user.role);
  await prisma.$disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });
