import authOptions from "@/app/auth/authOptions";
import { canEditIssue, canDeleteIssue, getCurrentUser } from "@/app/auth/authorization";
import { patchIssueSchema } from "@/app/validationSchemas";
import prisma from "@/prisma/client";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { logActivity } from "@/app/lib/activityLogger";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const user = await getCurrentUser();
    if (!user || user.role === 'VIEWER')
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const issueId = parseInt(params.id);
    const canEdit = await canEditIssue(issueId);
    if (!canEdit)
        return NextResponse.json({ error: 'Unauthorized to edit this issue' }, { status: 403 });

    const body = await request.json();
    const validation = patchIssueSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), {
            status: 400,
        });

    const { assignedToUserId, title, description, status, priority } = body;

    if (assignedToUserId) {
        const assignee = await prisma.user.findUnique({
            where: { id: assignedToUserId },
        });
        if (!assignee)
            return NextResponse.json(
                { error: "Invalid user." },
                { status: 400 }
            );
    }

    const issue = await prisma.issue.findUnique({
        where: { id: parseInt(params.id) },
    });
    if (!issue)
        return NextResponse.json(
            { error: "Invalid issue" },
            { status: 404 }
        );

    const updatedIssue = await prisma.issue.update({
        where: { id: issue.id },
        data: {
            title,
            description,
            assignedToUserId,
            status,
            priority
        },
    });

    // Log activities
    if (title && title !== issue.title) {
        await logActivity(issue.id, user.id, 'updated_title', `Changed title from "${issue.title}" to "${title}"`);
    }
    if (description && description !== issue.description) {
        await logActivity(issue.id, user.id, 'updated_description', 'Updated issue description');
    }
    if (status && status !== issue.status) {
        await logActivity(issue.id, user.id, 'status_changed', `Changed status from ${issue.status} to ${status}`);
    }
    if (priority && priority !== issue.priority) {
        await logActivity(issue.id, user.id, 'priority_changed', `Changed priority from ${issue.priority} to ${priority}`);
    }
    if (assignedToUserId !== undefined && assignedToUserId !== issue.assignedToUserId) {
        if (assignedToUserId === null) {
            await logActivity(issue.id, user.id, 'unassigned', 'Unassigned the issue');
        } else {
            const assignee = await prisma.user.findUnique({ where: { id: assignedToUserId } });
            await logActivity(issue.id, user.id, 'assigned', `Assigned to ${assignee?.name || assignee?.email}`);
        }
    }

    return NextResponse.json(updatedIssue);
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({}, { status: 401 });

    const issueId = parseInt(params.id);
    const canDelete = await canDeleteIssue(issueId);
    if (!canDelete)
        return NextResponse.json({ error: 'Unauthorized to delete this issue' }, { status: 403 });

    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
    });

    if (!issue)
        return NextResponse.json(
            { error: "Invalid issue" },
            { status: 404 }
        );

    await prisma.issue.delete({
        where: { id: issue.id },
    });

    return NextResponse.json({});
}