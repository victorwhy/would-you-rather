import { prisma } from "~/db.server";

export type { Topic } from "@prisma/client";

export function getTopics() {
  return prisma.topic.findMany({
    select: { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });
}
