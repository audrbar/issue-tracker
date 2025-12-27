import { getServerSession } from "next-auth";
import authOptions from "./authOptions";
import { Role } from "@prisma/client";
import prisma from "@/prisma/client";

export async function getCurrentUser() {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return null;

    const user = await prisma.user.findUnique({
        where: { email: session.user.email },
    });

    return user;
}

export async function hasRole(allowedRoles: Role[]) {
    const user = await getCurrentUser();
    if (!user) return false;
    return allowedRoles.includes(user.role);
}

export async function isAdmin() {
    return hasRole([Role.ADMIN]);
}

export async function canEditIssue(issueId: number) {
    const user = await getCurrentUser();
    if (!user) return false;

    // Admins can edit any issue
    if (user.role === Role.ADMIN) return true;

    // Viewers cannot edit
    if (user.role === Role.VIEWER) return false;

    // Users can edit their own issues
    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        select: { createdByUserId: true },
    });

    return issue?.createdByUserId === user.id;
}

export async function canDeleteIssue(issueId: number) {
    const user = await getCurrentUser();
    if (!user) return false;

    // Only admins and issue creators can delete
    if (user.role === Role.ADMIN) return true;

    const issue = await prisma.issue.findUnique({
        where: { id: issueId },
        select: { createdByUserId: true },
    });

    return issue?.createdByUserId === user.id;
}
