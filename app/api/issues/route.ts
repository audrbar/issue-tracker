import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { issueSchema } from '../../validationSchemas';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import { getCurrentUser } from '@/app/auth/authorization';
import { logActivity } from '@/app/lib/activityLogger';

export async function POST(request: NextRequest) {
    const session = await getServerSession(authOptions);
    if (!session)
        return NextResponse.json({}, { status: 401 });

    const user = await getCurrentUser();
    if (!user)
        return NextResponse.json({ error: 'User not found' }, { status: 403 });

    // Check role only if user has one assigned
    if (user.role === 'VIEWER')
        return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });

    const body = await request.json();
    const validation = issueSchema.safeParse(body);
    if (!validation.success)
        return NextResponse.json(validation.error.format(), { status: 400 });

    const newIssue = await prisma.issue.create({
        data: {
            title: body.title,
            description: body.description,
            createdByUserId: user.id
        },
    });

    // Only log activity if the issue was created successfully
    try {
        await logActivity(newIssue.id, user.id, 'created', `Created issue: ${newIssue.title}`);
    } catch (error) {
        console.error('Failed to log activity:', error);
    }

    return NextResponse.json(newIssue, { status: 201 });
}