-- DropForeignKey
ALTER TABLE "EventSpeakerMapping" DROP CONSTRAINT "EventSpeakerMapping_event_id_fkey";

-- DropForeignKey
ALTER TABLE "EventSpeakerMapping" DROP CONSTRAINT "EventSpeakerMapping_speaker_id_fkey";

-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_event_id_fkey";

-- AddForeignKey
ALTER TABLE "EventSpeakerMapping" ADD CONSTRAINT "EventSpeakerMapping_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSpeakerMapping" ADD CONSTRAINT "EventSpeakerMapping_speaker_id_fkey" FOREIGN KEY ("speaker_id") REFERENCES "Speaker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
