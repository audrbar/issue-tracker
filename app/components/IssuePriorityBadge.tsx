import { Badge } from '@radix-ui/themes';
import { Priority } from '@prisma/client';
import React from 'react';

const priorityMap: Record<
  Priority,
  { label: string; color: 'red' | 'yellow' | 'blue' }
> = {
  HIGH: { label: 'High', color: 'red' },
  MEDIUM: { label: 'Medium', color: 'yellow' },
  LOW: { label: 'Low', color: 'blue' },
};

const IssuePriorityBadge = ({ priority }: { priority: Priority }) => {
  return (
    <Badge color={priorityMap[priority].color}>
      {priorityMap[priority].label}
    </Badge>
  );
};

export default IssuePriorityBadge;
