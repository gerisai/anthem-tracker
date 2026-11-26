// Lists users, or sets a user's role (viewer, editor, admin).
// Usage:
//   npm run user:role                       # list users and their roles
//   npm run user:role -- <email|id> <role>  # set a role
// Uses DATABASE_URL from the environment, falling back to .env. For production:
//   DATABASE_URL="<production url>" npm run user:role -- you@example.com admin
import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();
const roles = Object.values(Role);

const main = async () => {
  const [who, role] = process.argv.slice(2);
  const { hostname } = new URL(process.env.DATABASE_URL ?? '');
  console.log(`Database: ${hostname}\n`);

  if (!who) {
    const users = await prisma.user.findMany({ orderBy: { name: 'asc' } });
    console.table(users.map(({ id, name, email, role }) => ({ id, name, email, role })));
    return;
  }

  if (!roles.includes(role as Role)) {
    console.error(`Role must be one of: ${roles.join(', ')}`);
    process.exit(1);
  }

  const user = await prisma.user.findFirst({
    where: { OR: [{ email: who }, { id: who }] }
  });

  if (!user) {
    console.error(`No user with email or id "${who}". Run without arguments to list users.`);
    process.exit(1);
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { role: role as Role }
  });

  console.log(`${user.name ?? user.id} <${user.email ?? 'no email'}>: ${user.role} -> ${role}`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
