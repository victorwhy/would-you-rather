-- Add custom constraint

ALTER TABLE "Vote"
ADD CONSTRAINT "Check_Comment_Or_Topic"
CHECK (
  ("commentId" IS NOT NULL)::integer +
  ("topicId" IS NOT NULL)::integer = 1
);