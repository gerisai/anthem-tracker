import { CurrentProgram } from '@/components/CurrentProgram';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
    params: Promise<{
      id: string;
    }>;
};

export default async function Program({ params }: Props) {
  const { id } = await params;
  const selectedFullProgram = await prisma.fullProgram.findUnique({
    where: {
      id: id
    },
    include: {
      programs: true,
      author: true
    }
  });

  let selectedPrograms: any[] = [];
  
  if (selectedFullProgram) {  
    for (const p of selectedFullProgram!.programs) {
      const sp = await prisma.program.findUnique({
          where: {
              id: p.id
          },
          include: {
              songs: true
          },
      });
      
      selectedPrograms = [...selectedPrograms, sp];
    }
  }
  
  return (
    <CurrentProgram programs={selectedPrograms} fullProgramId={selectedFullProgram!.id} author={selectedFullProgram!.author}/>
  )
}