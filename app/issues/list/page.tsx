import Pagination from '@/app/components/Pagination';
import prisma from '@/prisma/client';
import { Status } from '@prisma/client';
import IssueActions from './IssueActions';
import IssueTable, { IssueQuery, columnNames } from './IssueTable';
import { Flex } from '@radix-ui/themes';
import { Metadata } from 'next';

interface Props {
  searchParams: IssueQuery
}

const IssuesPage = async ({ searchParams }: Props) => {
  const statuses = Object.values(Status);
  const status = statuses.includes(searchParams.status)
    ? searchParams.status
    : undefined;

  // Build where clause with search and filters
  const where: any = { status };

  // Add search filter
  if (searchParams.search) {
    where.OR = [
      { title: { contains: searchParams.search } },
      { description: { contains: searchParams.search } },
    ];
  }

  // Add assignee filter
  if (searchParams.assignee) {
    if (searchParams.assignee === "unassigned") {
      where.assignedToUserId = null;
    } else {
      where.assignedToUserId = searchParams.assignee;
    }
  }

  const orderBy = columnNames
    .includes(searchParams.orderBy)
    ? { [searchParams.orderBy]: 'asc' }
    : undefined;

  const page = parseInt(searchParams.page) || 1;
  const pageSize = 10;

  const issues = await prisma.issue.findMany({
    where,
    orderBy,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  const issueCount = await prisma.issue.count({ where });

  // Fetch users for assignee filter
  const users = await prisma.user.findMany({
    orderBy: { name: 'asc' },
  });

  return (
    <Flex direction="column" gap="3">
      <IssueActions users={users} />
      <IssueTable searchParams={searchParams} issues={issues} />
      <Pagination
        pageSize={pageSize}
        currentPage={page}
        itemCount={issueCount}
      />
    </Flex>
  );
};

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Issue Tracker - Issue List',
  description: 'View all project issues'
};

export default IssuesPage;