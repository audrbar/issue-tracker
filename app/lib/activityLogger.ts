import prisma from "@/prisma/client";

export async function logActivity(
    issueId: number,
    userId: string,
    action: string,
    details?: string
) {
    await prisma.activityLog.create({
        data: {
            issueId,
            userId,
            action,
            details,
        },
    });
}
