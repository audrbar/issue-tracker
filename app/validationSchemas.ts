import z from 'zod';

// import { issueSchema } from '../../validationSchemas';
// import { getServerSession } from 'next-auth';
// import authOptions from '@/app/auth/authOptions';
export const createIssueSchema = z.object({
    title: z.string().min(1, 'Title is required.').max(255),
    description: z.string().min(1, 'Description is required.')
});
