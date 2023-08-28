import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { NextResponse } from 'next/server';
import { format } from 'path';

export async function POST(req: Request) {
  const data = await req.json();
  const stuff = await prisma.replacementSent.create({ data: data });
  return NextResponse.json(stuff);
}

export async function GET() {
  const data = await prisma.replacementSent.findMany({
    where: {
      OR: [{ status: 'Open' }, { status: 'Pending' }, { status: '' }], // Add the condition to filter by the state field
    },
    include: {
      requestedby: {
        select: {
          id: true,
          rep_name: true,
        },
      },
    },
  });
  // const formattedData = data.map((item) => ({
  //   ...item,
  //   reqname: item.requestedby?.rep_name,
  //   reqid: item.requestedby?.id,
  // }));
  return NextResponse.json(data);
}

export async function PUT(req: Request) {
  //{"id":{"id": 1},"data": {"rep_name":"1TB"} }
  const data = await req.json();
  const stuff = await prisma.replacementSent.update({
    where: data.id,
    data: data.data,
  });
  return NextResponse.json(stuff);
}

export async function DELETE(req: Request) {
  //{"id":{"id": 1}}
  const data = await req.json();
  const stuff = await prisma.replacementSent.delete({ where: data });
  return NextResponse.json(stuff);
}
