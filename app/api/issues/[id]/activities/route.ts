import prisma from "@/prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const activities = await prisma.activityLog.findMany({
        where: { issueId: parseInt(params.id) },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(activities);
}
