// Creates a test user and a NextAuth session in the LOCAL database and prints
// the cookie to log in as that user, without going through GitHub or Google.
// Usage: npm run dev:login [-- "Name" [viewer|editor|admin]]   (role defaults to editor)
import { randomBytes } from 'node:crypto';
import { Role } from '../generated/prisma/client';
import { prisma } from '../lib/prisma';

const url = new URL(process.env.DATABASE_URL ?? '');

// Never create sessions anywhere but a local database
if (!['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
  console.error(`Refusing to run: DATABASE_URL points to ${url.hostname}, not a local database.`);
  process.exit(1);
}

const main = async () => {
  const name = process.argv[2] ?? 'Dev User';
  const role = (process.argv[3] ?? 'editor') as Role;
  const email = `${name.toLowerCase().replace(/\s+/g, '.')}@localhost`;

  if (!Object.values(Role).includes(role)) {
    console.error(`Role must be one of: ${Object.values(Role).join(', ')}`);
    process.exit(1);
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: { name, email, role }
  });

  const sessionToken = randomBytes(32).toString('hex');
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: { sessionToken, userId: user.id, expires }
  });

  console.log(`Logged in as ${user.name} <${user.email}> (${user.role}) until ${expires.toISOString()}\n`);
  console.log('If you are already logged in, click "Cerrar Sesión" first: the existing session');
  console.log('cookie is httpOnly, so the line below cannot replace it.\n');
  console.log('Paste this in the browser console on http://localhost:3000, then reload:\n');
  console.log(`document.cookie = "next-auth.session-token=${sessionToken}; path=/; max-age=${30 * 24 * 60 * 60}"\n`);
  console.log('Or with curl:\n');
  console.log(`curl -b "next-auth.session-token=${sessionToken}" http://localhost:3000/...`);
};

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
