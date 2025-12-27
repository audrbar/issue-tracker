import { z } from "zod";

export const issueSchema = z.object({
    title: z.string().min(1, "Title is required.").max(255),
    description: z
        .string()
        .min(1, "Description is required.")
        .max(65535),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export const patchIssueSchema = z.object({
    title: z
        .string()
        .min(1, "Title is required.")
        .max(255)
        .optional(),
    description: z
        .string()
        .min(1, "Description is required.")
        .max(65535)
        .optional(),
    assignedToUserId: z
        .string()
        .min(1, "AssignedToUserId is required.")
        .max(255)
        .optional()
        .nullable(),
    status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
    priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export const commentSchema = z.object({
    text: z.string().min(1, "Comment is required.").max(65535),
});