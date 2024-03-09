-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "posterImage" TEXT NOT NULL DEFAULT 'default_poster_image.jpg',
ADD COLUMN     "thumbnailImage" TEXT NOT NULL DEFAULT 'default_thumbnail_image.jpg';
