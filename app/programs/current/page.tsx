import { CurrentProgram } from '@/components/CurrentProgram';
import { prisma } from '@/lib/prisma';

export default async function Programs() {
  const currentPrograms = await prisma.program.findMany({
    where: {
      isCurrent: true
    },
    include: {
      songs: true
    }
  });

  return (
    <CurrentProgram programs={currentPrograms} />
  )
}
