import { CurrentProgram } from '@/components/CurrentProgram';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

interface Props {
    params: {
      id: string;
    };
};

export default async function Program({ params }: Props) {
  const selectedFullProgram = await prisma.fullProgram.findUnique({
    where: {
      id: params.id
    },
    include: {
      programs: true,
      author: true
    }
  });

  let selectedPrograms: any[] = [];
  
  if (selectedFullProgram) {  
    for (let p of selectedFullProgram!.programs) {
      let sp = await prisma.program.findUnique({
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