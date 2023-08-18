import { HistoryPage } from '@/components/HistoryPage';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function History() {
    const allPrograms = await prisma.fullProgram.findMany();
    
    return (
        <HistoryPage programs={allPrograms}/>
    )
}