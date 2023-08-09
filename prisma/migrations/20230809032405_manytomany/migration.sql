-- DropForeignKey
ALTER TABLE "Song" DROP CONSTRAINT "Song_programId_fkey";

-- CreateTable
CREATE TABLE "_ProgramToSong" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProgramToSong_AB_unique" ON "_ProgramToSong"("A", "B");

-- CreateIndex
CREATE INDEX "_ProgramToSong_B_index" ON "_ProgramToSong"("B");

-- AddForeignKey
ALTER TABLE "_ProgramToSong" ADD CONSTRAINT "_ProgramToSong_A_fkey" FOREIGN KEY ("A") REFERENCES "Program"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProgramToSong" ADD CONSTRAINT "_ProgramToSong_B_fkey" FOREIGN KEY ("B") REFERENCES "Song"("id") ON DELETE CASCADE ON UPDATE CASCADE;
