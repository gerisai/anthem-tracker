import { NewProgramPage } from '@/components/NewProgramPage';
import { prisma } from '@/lib/prisma';

export default async function Songs() { 
    const songs = await prisma.song.findMany();
    
    return (
        <NewProgramPage songs={songs}/>
    )
}