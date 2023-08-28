import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const stuff = await prisma.refundSheet.create({ data: data });
  return NextResponse.json(stuff);
}

export async function GET() {
  const data = await prisma.refundSheet.findMany({
    where: {
      status: 'Closed', // Add the condition to filter by the state field
    },
    include: {
      requestedby: {
        select: {
          id: true,
          rep_name: true,
        },
      },
      refundedby: {
        select: {
          id: true,
          rep_name: true,
        },
      },
    },
  });
  const formattedData = data.map((item) => ({
    ...item,
    reqId: item.requestedby?.rep_name,
    refId: item.refundedby?.rep_name,
  }));

  return NextResponse.json(formattedData);
}

export async function PUT(req: Request) {
  //{"id":{"id": 1},"data": {"rep_name":"1TB"} }
  const data = await req.json();
  const stuff = await prisma.refundSheet.update({
    where: data.id,
    data: data.data,
  });
  return NextResponse.json(stuff);
}

export async function DELETE(req: Request) {
  //{"id":{"id": 1}}
  const data = await req.json();
  const stuff = await prisma.refundSheet.delete({ where: data });
  return NextResponse.json(stuff);
}
