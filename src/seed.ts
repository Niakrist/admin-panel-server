import { PrismaClient } from '../generated/prisma';
import { faker } from '@faker-js/faker';
import { hash } from 'argon2';
import 'dotenv/config';

const prisma = new PrismaClient();

const countries = ['Russia', 'China', 'Brazil', 'India', 'South Africa', 'UAE'];

async function main() {
  const NUM_USERS = 200;
  for (let i = 0; i < NUM_USERS; i++) {
    const email = faker.internet.email();
    const name = faker.person.firstName();
    const avatarUrl = faker.image.avatar();
    const password = await hash('123456');
    const role = 'USER';
    const country = faker.helpers.arrayElement(countries);
    const createdAt = faker.date.past({ years: 1 });
    const updatedAt = new Date(
      createdAt.getTime() +
        Math.random() * (new Date().getTime() - createdAt.getTime()),
    );

    await prisma.user.create({
      data: {
        email,
        name,
        avatarUrl,
        password,
        role,
        country,
        createdAt,
        updatedAt,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  .finally(async () => {
    await prisma.$disconnect();
  });
