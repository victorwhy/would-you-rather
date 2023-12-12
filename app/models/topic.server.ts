import type { Topic, User, Choice } from "@prisma/client";

import { prisma } from "~/db.server";
import { cleanTrailingQuestion } from "~/utils";

export type { Topic } from "@prisma/client";

export function getTopic(id: Topic["id"]) {
  return prisma.topic.findFirst({
    select: {
      id: true,
      description: true,
      title:true,
      choices: true,
      comments: {
        select: {
          id: true,
          body: true,
          author: true,
          choiceId: true,
          parentId: true,
          votes: true,
          createdAt: true,
        }
      }
    },
    where: { id },
  });
}

export function getTopics() {
  return prisma.topic.findMany({
    select: { id: true, title: true, choices: true },
    orderBy: { createdAt: "desc" },
  });
}

export async function getTopicsVotes() {
  const result = await prisma.$queryRaw<({id: Topic["id"]} & {topicVotes: bigint} )[]>`
    SELECT "Topic".id, SUM("Choice".votes) as topicVotes
    FROM "Topic"
    JOIN "Choice" ON "Topic".id = "Choice"."topicId"
    GROUP BY "Topic"."id"
    ORDER BY topicVotes DESC
  `;
  return result;
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
      title: cleanTrailingQuestion(title),
      description,
      authorId: userId,
      choices: {
        create: [
          { body: cleanTrailingQuestion(choice1) },
          { body: cleanTrailingQuestion(choice2) }
        ]
      }
    },
  });

  return topic;
}