import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

import { cleanTrailingQuestion } from "~/utils";

import { seedData } from "./topicSeed";

const prisma = new PrismaClient();

async function seed() {
  const email = "lunacraz@gmail.com";
  const name = "username";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("lunacraz123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  for (const { title, description, choice1, choice2 } of seedData) {
    await prisma.topic.create({
      data: {
        title: cleanTrailingQuestion(title),
        description,
        authorId: user.id,
        choices: {
          create: [
            { body: cleanTrailingQuestion(choice1) },
            { body: cleanTrailingQuestion(choice2) }
          ]
        }
      },
    })
  }

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
