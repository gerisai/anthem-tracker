const { anthems } = require('./data');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

const load = async () => {
    try {
        await prisma.song.deleteMany();
        // await prisma.program.deleteMany();
        // await prisma.fullProgram.deleteMany();
        console.log('Deleted records');
        await prisma.song.createMany({
            data: anthems
        });
        console.log('Seeded new records');
    } catch(e) {
        console.error(e);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

load();