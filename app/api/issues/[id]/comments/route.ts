import authOptions from "@/app/auth/authOptions";
import { commentSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const comments = await prisma.comment.findMany({
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
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(comments);
}

export async function POST(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const body = await request.json();
    const validation = commentSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(params.id) },
    });
    if (!issue)
        return NextResponse.json({ error: "Invalid issue" }, { status: 404 });

    const comment = await prisma.comment.create({
        data: {
            text: body.text,
            issueId: issue.id,
            userId: session.user!.id,
        },
        include: {
            user: {
                select: {
                    name: true,
                    email: true,
                    image: true,
                },
            },
        },
    });

    return NextResponse.json(comment, { status: 201 });
}
