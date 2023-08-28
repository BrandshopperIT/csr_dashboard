import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const data = await req.json();
  const stuff = await prisma.unresOA.create({ data: data });
  return NextResponse.json(stuff);
}
//This GET will go into the relation field, connect to the 'Rep' table and select the rep_name based on the ID. The 'formattedData' variable goes through each record in the JSON, changes the repId, auditorId, and the reptwoId to display the name of the user. When the above is done, it creates a new key based on the related field names. So it creates a 'rep', 'auditor', and 'reptwo'. This is fine and all BUT since we're already replacing the ID with the name, we don't need those. So we marked these fields as 'undefined' so they wont show in the API response. 'data' can't actually be changed, so it's being copied to 'formattedData', modfiied, and then passed as the JSON in the NextResponse.
export async function GET() {
  const data = await prisma.unresOA.findMany({
    where: {
      status: 'Open', // Add the condition to filter by the state field
    },
    include: {
      rep: {
        select: {
          id: true,
          rep_name: true,
        },
      },
      auditor: {
        select: {
          id: true,
          rep_name: true,
        },
      },
      reptwo: {
        select: {
          id: true,
          rep_name: true,
        },
      },
    },
  });
  const formattedData = data.map((item) => ({
    ...item,
    repId: item.rep?.rep_name,
    auditorId: item.auditor?.rep_name,
    reptwoId: item.reptwo?.rep_name,
    rep: item.rep,
    auditor: item.auditor,
    reptwo: item.reptwo,
    date_reviewed: item.date_reviewed === '' ? null : item.date_reviewed,
  }));

  return NextResponse.json(formattedData);
}

export async function PUT(req: Request) {
  //{"id":{"id": 1},"data": {"rep_name":"1TB"} }
  const data = await req.json();
  // const arr_data = [data];

  // const formattedData = arr_data.map((item: any) => {
  //   const { recordId, ...data } = item;
  //   return {
  //     id: { id: recordId },
  //     data: { ...data },
  //   };
  // });
  const stuff = await prisma.unresOA.update({
    where: data.id,
    data: data.data,
  });
  return NextResponse.json(data);
}

export async function DELETE(req: Request) {
  //{"id":{"id": 1}}
  const data = await req.json();
  const stuff = await prisma.unresOA.delete({ where: data });
  return NextResponse.json(stuff);
}
