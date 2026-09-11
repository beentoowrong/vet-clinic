-- DropForeignKey
ALTER TABLE "breeds" DROP CONSTRAINT "breeds_speciesId_fkey";

-- AddForeignKey
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE CASCADE ON UPDATE CASCADE;
