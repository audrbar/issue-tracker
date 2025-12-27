import prisma from '@/prisma/client';
import { Box, Flex, Grid } from '@radix-ui/themes';
import { notFound } from 'next/navigation';
import EditIssueButton from './EditIssueButton';
import IssueDetails from './IssueDetails';
import DeleteIssueButton from './DeleteIssueButton';
import { getServerSession } from 'next-auth';
import authOptions from '@/app/auth/authOptions';
import AssigneeSelect from './AssigneeSelect';
import StatusSelect from './StatusSelect';
import PrioritySelect from './PrioritySelect';
import Comments from './Comments';
import ActivityTimeline from './ActivityTimeline';
import { cache } from 'react';

interface Props {
  params: { id: string };
}

const fetchIssue = cache((issueId: number) => prisma.issue.findUnique({ where: { id: issueId }}));

const IssueDetailPage = async ({ params }: Props) => {
  const session = await getServerSession(authOptions);

  const issue = await fetchIssue(parseInt(params.id));

  if (!issue) notFound();

  return (
    <>
      <Grid columns={{ initial: '1', sm: '5' }} gap="5">
        <Box className="md:col-span-4">
          <IssueDetails issue={issue} />
        </Box>
        {session && (
          <Box>
            <Flex direction="column" gap="4">
              <StatusSelect issue={issue} />
              <PrioritySelect issue={issue} />
              <AssigneeSelect issue={issue} />
              <EditIssueButton issueId={issue.id} />
              <DeleteIssueButton issueId={issue.id} />
            </Flex>
          </Box>
        )}
      </Grid>
      {session && (
        <Grid columns={{ initial: '1', md: '2' }} gap="5" mt="5">
          <Box>
            <Comments issueId={issue.id} />
          </Box>
          <Box>
            <ActivityTimeline issueId={issue.id} />
          </Box>
        </Grid>
      )}
    </>
  );
};

export async function generateMetadata({ params }: Props) {
  const issue = await fetchIssue(parseInt(params.id));

  return {
    title: issue?.title,
    description: 'Details of issue ' + issue?.id
  }
}

export default IssueDetailPage;