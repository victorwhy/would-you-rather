import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seed() {
  const email = "lunacraz@gmail.com";

  // cleanup the existing database
  await prisma.user.delete({ where: { email } }).catch(() => {
    // no worries if it doesn't exist yet
  });

  const hashedPassword = await bcrypt.hash("lunacraz123", 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
    },
  });

  const topic = await prisma.topic.create({
    data: {
      title: "Regeneration or Healing",
      description: "Regeneration allows you to perfectly heal only yourself of every wound, disease, missing limb, etc. which makes you immortal. Healing allows you to heal yourself and others of almost all wounds, but you can't regenerate your own or someone else's limbs, head, etc.",
      authorId: user.id,
    },
  });

  await prisma.choice.create({
    data: {
      body: "have Regeneration",
      topicId: topic.id,
    },
  });

  await prisma.choice.create({
    data: {
      body: "have Healing",
      topicId: topic.id,
    },
  });

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
