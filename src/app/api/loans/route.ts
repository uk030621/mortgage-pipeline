import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Loan from "@/models/Loan";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectToDatabase();
  const loans = await Loan.find({ ownerEmail: session.user.email }).sort({
    updatedAt: -1,
  });

  return NextResponse.json(loans);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  if (!body.borrowerName) {
    return NextResponse.json(
      { error: "borrowerName is required" },
      { status: 400 }
    );
  }

  await connectToDatabase();
  const loan = await Loan.create({
    ...body,
    ownerEmail: session.user.email,
  });

  return NextResponse.json(loan, { status: 201 });
}
