"use client";

import { Issue, Priority } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const PrioritySelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const priorityOptions: { label: string; value: Priority }[] = [
    { label: "Low", value: "LOW" },
    { label: "Medium", value: "MEDIUM" },
    { label: "High", value: "HIGH" },
  ];

  const changePriority = async (priority: Priority) => {
    if (priority === issue.priority) return;

    setIsChanging(true);
    try {
      await axios.patch(`/api/issues/${issue.id}`, {
        priority: priority,
      });
      router.refresh();
      toast.success(`Priority changed to ${priorityOptions.find(p => p.value === priority)?.label}`);
    } catch {
      toast.error("Changes could not be saved.");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Select.Root
      defaultValue={issue.priority}
      onValueChange={changePriority}
      disabled={isChanging}
    >
      <Select.Trigger placeholder="Change priority..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Priority</Select.Label>
          {priorityOptions.map((priority) => (
            <Select.Item key={priority.value} value={priority.value}>
              {priority.label}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default PrioritySelect;
