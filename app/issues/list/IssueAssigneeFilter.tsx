"use client";

import { Select } from "@radix-ui/themes";
import { useRouter, useSearchParams } from "next/navigation";
import { User } from "@prisma/client";

const IssueAssigneeFilter = ({ users }: { users: User[] }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const changeAssignee = (assigneeId: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (assigneeId === "all") {
      params.delete("assignee");
    } else if (assigneeId === "unassigned") {
      params.set("assignee", "unassigned");
    } else {
      params.set("assignee", assigneeId);
    }
    
    params.delete("page"); // Reset to page 1
    
    const query = params.toString() ? `?${params.toString()}` : "";
    router.push(`/issues/list${query}`);
  };

  return (
    <Select.Root
      defaultValue={searchParams.get("assignee") || "all"}
      onValueChange={changeAssignee}
    >
      <Select.Trigger placeholder="Filter by assignee..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Assignee</Select.Label>
          <Select.Item value="all">All Issues</Select.Item>
          <Select.Item value="unassigned">Unassigned</Select.Item>
          <Select.Separator />
          {users.map((user) => (
            <Select.Item key={user.id} value={user.id}>
              {user.name || user.email}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default IssueAssigneeFilter;
