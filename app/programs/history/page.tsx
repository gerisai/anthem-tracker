import { HistoryPage } from '@/components/HistoryPage';
import { prisma } from '@/lib/prisma';

export default async function History() {
    const allPrograms = await prisma.fullProgram.findMany();
    
    return (
        <HistoryPage programs={allPrograms}/>
    )
}