import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  try {
    // Create default user if it doesn't exist
    let user = await prisma.user.findUnique({
      where: {
        email: "test@test.com",
      },
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email: "test@test.com",
          name: "Tester"
        },
      });
    }

    // Create ERP products
    const products = [
      {
        name: "ERP Basic License",
        description: "Annual subscription for basic ERP features including inventory and order management",
        price: 1999.99
      },
      {
        name: "ERP Professional License",
        description: "Annual subscription with advanced features including financial management and reporting",
        price: 3999.99
      },
      {
        name: "ERP Enterprise License",
        description: "Full-featured ERP solution with unlimited users, custom integrations, and 24/7 support",
        price: 7999.99
      },
      {
        name: "Implementation Service",
        description: "Professional ERP system setup, data migration, and staff training",
        price: 5000.00
      },
      {
        name: "Custom Module Development",
        description: "Custom development of specialized ERP modules for unique business needs",
        price: 2500.00
      },
      {
        name: "Premium Support Package",
        description: "24/7 priority support with dedicated account manager and monthly system health checks",
        price: 999.99
      }
    ];

    // Clear existing products
    await prisma.product.deleteMany();

    // Create new products and store their IDs
    const createdProducts = [];
    for (const product of products) {
      const createdProduct = await prisma.product.create({
        data: product
      });
      createdProducts.push(createdProduct);
    }

    // Create a purchase order with two items using the first two products
    await prisma.purchaseOrder.create({
      data: {
        userId: user.id,
        orderNumber: 'PO-SEED-001',
        status: 'COMPLETED',
        totalAmount: createdProducts[0].price + createdProducts[1].price,
        lineItems: {
          create: [
            {
              productId: createdProducts[0].id,
              quantity: 1,
              unitPrice: createdProducts[0].price,
              totalPrice: createdProducts[0].price * 1,
            },
            {
              productId: createdProducts[1].id,
              quantity: 1,
              unitPrice: createdProducts[1].price,
              totalPrice: createdProducts[1].price * 1,
            },
          ],
        },
      },
      include: {
        lineItems: true,
      },
    });

    console.log("Seed completed successfully");
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
