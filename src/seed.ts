import { PrismaClient } from '@prisma/client';
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
    const created_at = faker.date.past({ years: 1 });
    const updated_at = new Date(
      created_at.getTime() +
        Math.random() * (new Date().getTime() - created_at.getTime()),
    );

    await prisma.user.create({
      date: {
        email,
        name,
        avatarUrl,
        password,
        role,
        country,
        created_at,
        updated_at,
      },
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
