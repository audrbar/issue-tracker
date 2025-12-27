"use client";

import { Avatar, Box, Button, Card, Flex, Text, TextArea } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import ReactMarkdown from "react-markdown";
import { useQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

interface Comment {
  id: number;
  text: string;
  createdAt: string;
  user: {
    name: string | null;
    email: string | null;
    image: string | null;
  };
}

const Comments = ({ issueId }: { issueId: number }) => {
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    data: comments,
    isLoading,
    refetch,
  } = useQuery<Comment[]>({
    queryKey: ["comments", issueId],
    queryFn: () =>
      axios.get(`/api/issues/${issueId}/comments`).then((res) => res.data),
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      await axios.post(`/api/issues/${issueId}/comments`, {
        text: newComment,
      });
      setNewComment("");
      refetch();
      router.refresh();
      toast.success("Comment added successfully");
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box>
      <Text size="5" weight="bold" mb="4">
        Comments
      </Text>

      {/* Comment Form */}
      <Card mb="4">
        <form onSubmit={handleSubmit}>
          <Flex direction="column" gap="3">
            <TextArea
              placeholder="Write a comment... (supports Markdown)"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={4}
            />
            <Flex justify="end">
              <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? "Posting..." : "Post Comment"}
              </Button>
            </Flex>
          </Flex>
        </form>
      </Card>

      {/* Comments List */}
      <Flex direction="column" gap="3">
        {isLoading ? (
          <>
            <Skeleton height={100} />
            <Skeleton height={100} />
          </>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <Card key={comment.id}>
              <Flex gap="3">
                <Avatar
                  src={comment.user.image || undefined}
                  fallback={comment.user.name?.[0] || "U"}
                  size="2"
                  radius="full"
                />
                <Box style={{ flex: 1 }}>
                  <Flex justify="between" mb="2">
                    <Text size="2" weight="bold">
                      {comment.user.name || comment.user.email}
                    </Text>
                    <Text size="1" color="gray">
                      {new Date(comment.createdAt).toLocaleString()}
                    </Text>
                  </Flex>
                  <Box className="prose prose-sm max-w-none">
                    <ReactMarkdown>{comment.text}</ReactMarkdown>
                  </Box>
                </Box>
              </Flex>
            </Card>
          ))
        ) : (
          <Card>
            <Text size="2" color="gray">
              No comments yet. Be the first to comment!
            </Text>
          </Card>
        )}
      </Flex>
    </Box>
  );
};

export default Comments;
