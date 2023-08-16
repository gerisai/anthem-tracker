import { EditProgramPage } from '@/components/EditProgramPage';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';

interface Props {
    params: {
      id: string;
    };
};

export default async function EditProgram({ params }: Props) {
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect('/api/auth/signin');
    }
    
    const songs = await prisma.song.findMany();
  
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
    <EditProgramPage songs={songs} existingPrograms={selectedPrograms}/>
  )
}