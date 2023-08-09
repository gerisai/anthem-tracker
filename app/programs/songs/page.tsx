import { SongsPage } from '@/components/SongsPage';
import { prisma } from '@/lib/prisma';

export default async function Songs() { 
    const songs = await prisma.song.findMany();
    
    return (
        <SongsPage songs={songs}/>
    )
}