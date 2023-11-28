import type { Comment } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Comment } from "@prisma/client";

export async function createComment({ body, authorId, topicId}: Pick<Comment, "authorId" | "body" | "topicId">) {
  return prisma.comment.create({
    data: {
      body: body,
      authorId: authorId,
      topicId: topicId
    },
  });
}