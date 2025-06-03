import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return new NextResponse("Invalid request. Items array is required.", { status: 400 });
    }

    // Calculate total amount and create line items
    let totalAmount = 0;
    const lineItems = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });

      if (!product) {
        return new NextResponse(`Product not found: ${item.productId}`, { status: 404 });
      }

      const lineItemTotal = product.price * item.quantity;
      totalAmount += lineItemTotal;

      lineItems.push({
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: product.price,
        totalPrice: lineItemTotal,
      });
    }

    // Create the purchase order with line items
    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        userId: userId,
        orderNumber: `PO-${Date.now()}`,
        status: "COMPLETED",
        totalAmount,
        lineItems: {
          create: lineItems
        }
      },
      include: {
        lineItems: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json(purchaseOrder);
  } catch (error) {
    console.error("[PURCHASES_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const purchases = await prisma.purchaseOrder.findMany({
      where: {
        userId
      },
      include: {
        lineItems: {
          include: {
            product: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error("[PURCHASES_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
} 