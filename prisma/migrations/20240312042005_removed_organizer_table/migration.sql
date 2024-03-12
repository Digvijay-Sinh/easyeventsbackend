/*
  Warnings:

  - You are about to drop the `Organizer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Event" DROP CONSTRAINT "Event_organizer_id_fkey";

-- DropTable
DROP TABLE "Organizer";

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_organizer_id_fkey" FOREIGN KEY ("organizer_id") REFERENCES "UserDemo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
