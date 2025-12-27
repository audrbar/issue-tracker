"use client";

import { Issue, Status } from "@prisma/client";
import { Select } from "@radix-ui/themes";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

const StatusSelect = ({ issue }: { issue: Issue }) => {
  const router = useRouter();
  const [isChanging, setIsChanging] = useState(false);

  const statusOptions: { label: string; value: Status }[] = [
    { label: "Open", value: "OPEN" },
    { label: "In Progress", value: "IN_PROGRESS" },
    { label: "Closed", value: "CLOSED" },
  ];

  const changeStatus = async (status: Status) => {
    if (status === issue.status) return;

    setIsChanging(true);
    try {
      await axios.patch(`/api/issues/${issue.id}`, {
        status: status,
      });
      router.refresh();
      toast.success(`Issue status changed to ${statusOptions.find(s => s.value === status)?.label}`);
    } catch {
      toast.error("Changes could not be saved.");
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <Select.Root
      defaultValue={issue.status}
      onValueChange={changeStatus}
      disabled={isChanging}
    >
      <Select.Trigger placeholder="Change status..." />
      <Select.Content>
        <Select.Group>
          <Select.Label>Status</Select.Label>
          {statusOptions.map((status) => (
            <Select.Item key={status.value} value={status.value}>
              {status.label}
            </Select.Item>
          ))}
        </Select.Group>
      </Select.Content>
    </Select.Root>
  );
};

export default StatusSelect;
