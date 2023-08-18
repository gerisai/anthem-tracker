import { SongsPage } from '@/components/SongsPage';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function Songs() { 
    const songs = await prisma.song.findMany();
    
    return (
        <SongsPage songs={songs}/>
    )
}