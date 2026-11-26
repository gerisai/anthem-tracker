import { NewProgramPage } from '@/components/NewProgramPage';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { canCreate } from '@/lib/permissions';

export const dynamic = 'force-dynamic';

export default async function Songs() { 
    const session = await getServerSession(authOptions);

    if (!session) {
      redirect('/api/auth/signin');
    }
    if (!canCreate(session.user)) {
      redirect('/programs/current');
    }
    
    const songs = await prisma.song.findMany();
    
    return (
        <NewProgramPage songs={songs}/>
    )
}