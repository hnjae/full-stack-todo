import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const userExample = await prisma.user.upsert({
    where: { email: 'example@example.com' },
    update: {},
    create: {
      email: 'exampleexample.com',
      password: 'example',
    },
  });

  console.log(userExample);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
