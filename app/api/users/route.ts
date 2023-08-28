import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const stuff = await prisma.users.create({ data: data });
  return NextResponse.json(stuff);
}

export async function GET() {
  const data = await prisma.users.findMany();
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  //{"id":{"id": 1},"data": {"rep_name":"1TB"} }
  const data = await req.json();
  const stuff = await prisma.users.update({
    where: data.id,
    data: data.data,
  });
  return NextResponse.json(stuff);
}

export async function DELETE(req: Request) {
  //{"id":{"id": 1}}
  const data = await req.json();
  const stuff = await prisma.users.delete({ where: data });
  return NextResponse.json(stuff);
}
