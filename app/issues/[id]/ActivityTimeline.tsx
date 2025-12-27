"use client";

import { Avatar, Box, Card, Flex, Text } from "@radix-ui/themes";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface ActivityLog {
  id: number;
  action: string;
  details: string | null;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

const ActivityTimeline = ({ issueId }: { issueId: number }) => {
  const { data: activities, isLoading } = useQuery<ActivityLog[]>({
    queryKey: ["activities", issueId],
    queryFn: () =>
      axios.get(`/api/issues/${issueId}/activities`).then((res) => res.data),
  });

  const getActionIcon = (action: string) => {
    const icons: { [key: string]: string } = {
      created: "✨",
      status_changed: "🔄",
      assigned: "👤",
      unassigned: "👥",
      updated_title: "✏️",
      updated_description: "📝",
      commented: "💬",
    };
    return icons[action] || "📌";
  };

  return (
    <Box>
      <Text size="5" weight="bold" mb="4">
        Activity Timeline
      </Text>

      {isLoading ? (
        <>
          <Skeleton height={60} style={{ marginBottom: "8px" }} />
          <Skeleton height={60} style={{ marginBottom: "8px" }} />
          <Skeleton height={60} />
        </>
      ) : activities && activities.length > 0 ? (
        <Flex direction="column" gap="2">
          {activities.map((activity, index) => (
            <Card key={activity.id} variant="surface">
              <Flex gap="3" align="start">
                <Text size="4">{getActionIcon(activity.action)}</Text>
                <Box style={{ flex: 1 }}>
                  <Flex justify="between" mb="1">
                    <Flex gap="2" align="center">
                      <Avatar
                        src={activity.user.image || undefined}
                        fallback={activity.user.name?.[0] || "U"}
                        size="1"
                        radius="full"
                      />
                      <Text size="2" weight="bold">
                        {activity.user.name || activity.user.email}
                      </Text>
                    </Flex>
                    <Text size="1" color="gray">
                      {new Date(activity.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                  <Text size="2" color="gray">
                    {activity.details || activity.action.replace(/_/g, " ")}
                  </Text>
                </Box>
              </Flex>
            </Card>
          ))}
        </Flex>
      ) : (
        <Card>
          <Text size="2" color="gray">
            No activity history yet.
          </Text>
        </Card>
      )}
    </Box>
  );
};

export default ActivityTimeline;
