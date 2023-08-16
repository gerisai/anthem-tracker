import { CurrentProgram } from '@/components/CurrentProgram';
import { prisma } from '@/lib/prisma';

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
      programs: true
    }
  });

  let selectedPrograms: any[] = [];
  
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
  
  return (
    <CurrentProgram programs={selectedPrograms} fullProgramId={selectedFullProgram!.id}/>
  )
}