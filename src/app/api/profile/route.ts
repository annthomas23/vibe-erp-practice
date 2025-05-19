import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const user = await prisma.user.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(user);
}
