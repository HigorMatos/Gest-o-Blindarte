import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin", description: "Administrador" },
  });

  const user = await prisma.user.upsert({
    where: { email: "admin@gesto.local" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@gesto.local",
      passwordHash: await bcrypt.hash("admin123", 10),
      roles: { create: [{ roleId: adminRole.id }] },
    },
  });

  console.log("Seeded admin user", user.email);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
