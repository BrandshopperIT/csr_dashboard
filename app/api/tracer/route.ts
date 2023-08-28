import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const stuff = await prisma.tracerReq.create({ data: data });
  return NextResponse.json(stuff);
}

export async function GET() {
  const data = await prisma.tracerReq.findMany({
    where: {
      status: 'Open', // Add the condition to filter by the state field
    },
    include: {
      therep: {
        select: {
          id: true,
          rep_name: true,
        },
      },
      submit: {
        select: {
          id: true,
          rep_name: true,
        },
      },
    },
  });

  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  //{"id":{"id": 1},"data": {"rep_name":"1TB"} }
  const data = await req.json();
  const stuff = await prisma.tracerReq.update({
    where: data.id,
    data: data.data,
  });
  return NextResponse.json(stuff);
}

export async function DELETE(req: Request) {
  //{"id":{"id": 1}}
  const data = await req.json();
  const stuff = await prisma.tracerReq.delete({ where: data });
  return NextResponse.json(stuff);
}
