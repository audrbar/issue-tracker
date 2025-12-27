import { Button, Flex } from '@radix-ui/themes';
import Link from 'next/link';
import React from 'react';
import IssueStatusFilter from './IssueStatusFilter';
import IssueSearchBar from './IssueSearchBar';
import IssueAssigneeFilter from './IssueAssigneeFilter';
import { User } from '@prisma/client';

const IssueActions = ({ users }: { users: User[] }) => {
  return (
    <Flex direction="column" gap="3">
      <Flex justify="between">
        <Flex gap="3">
          <IssueSearchBar />
          <IssueStatusFilter />
          <IssueAssigneeFilter users={users} />
        </Flex>
        <Button>
          <Link href="/issues/new">New Issue</Link>
        </Button>
      </Flex>
    </Flex>
  );
};

export default IssueActions;