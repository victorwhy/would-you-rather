import type { Comment } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Comment } from "@prisma/client";

export async function createComment({ body, authorId, topicId, parentId }: Pick<Comment, "authorId" | "body" | "topicId" | "parentId">) {
  return prisma.comment.create({
    data: {
      body: body,
      authorId: authorId,
      topicId: topicId,
      parentId: parentId
    },
  });
}