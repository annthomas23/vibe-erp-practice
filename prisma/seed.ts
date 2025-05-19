import { prisma } from "@/lib/db";

async function main() {
  try {
    let user = await prisma.user.findUnique({
      where: {
        email: "test@test.com",
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "test@test.com",
        },
      });
    }

    console.log("Seed completed successfully:", user);
  } catch (error) {
    console.error("Error during seeding:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
