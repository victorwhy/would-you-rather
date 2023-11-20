import type { Topic, User, Choice } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Topic } from "@prisma/client";

export function getTopics() {
  return prisma.topic.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function createTopic({
  title,
  description,
  choice1,
  choice2,
  userId,
}: Pick<Topic, "description" | "title"> & {
  userId: User["id"];
} & {
  choice1: Choice["body"];
} &{
  choice2: Choice["body"];
}) {
  const topic = await prisma.topic.create({
    data: {
      title,
      description,
      authorId: userId,
    },
  });

  await prisma.choice.create({
    data: {
      body: choice1,
      topicId: topic.id,
    },
  });

  await prisma.choice.create({
    data: {
      body: choice2,
      topicId: topic.id,
    },
  });

  return topic;
}