import type { Choice } from "@prisma/client";

import { prisma } from "~/db.server";

export type { Choice } from "@prisma/client";

export function getChoice({ id }: Pick<Choice, "id">) {
  return prisma.choice.findFirst({
    select: { id: true, votes: true, body: true },
    where: { id },
  });
}

export async function incrementChoice({ id }: Pick<Choice, "id">) {
  return prisma.choice.update({
    where: { id },
    data: {
      votes: {
        increment: 1
      }
    }
  });
}