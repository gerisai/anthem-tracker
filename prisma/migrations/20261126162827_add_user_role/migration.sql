-- CreateEnum
CREATE TYPE "Role" AS ENUM ('viewer', 'editor', 'admin');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'viewer';
