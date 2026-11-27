-- AlterTable
ALTER TABLE "_FullProgramToProgram" ADD CONSTRAINT "_FullProgramToProgram_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_FullProgramToProgram_AB_unique";

-- AlterTable
ALTER TABLE "_ProgramToSong" ADD CONSTRAINT "_ProgramToSong_AB_pkey" PRIMARY KEY ("A", "B");

-- DropIndex
DROP INDEX "_ProgramToSong_AB_unique";
