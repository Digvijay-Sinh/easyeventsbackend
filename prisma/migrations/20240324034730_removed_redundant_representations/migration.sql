/*
  Warnings:

  - You are about to drop the `_EventToSpeaker` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_EventToSpeaker" DROP CONSTRAINT "_EventToSpeaker_A_fkey";

-- DropForeignKey
ALTER TABLE "_EventToSpeaker" DROP CONSTRAINT "_EventToSpeaker_B_fkey";

-- DropTable
DROP TABLE "_EventToSpeaker";
