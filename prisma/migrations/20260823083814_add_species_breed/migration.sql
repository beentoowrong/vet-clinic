/*
  Warnings:

  - You are about to drop the column `breed` on the `pets` table. All the data in the column will be lost.
  - You are about to drop the column `species` on the `pets` table. All the data in the column will be lost.
  - Added the required column `breedId` to the `pets` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speciesId` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" DROP COLUMN "breed",
DROP COLUMN "species",
ADD COLUMN     "breedId" INTEGER NOT NULL,
ADD COLUMN     "speciesId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Species" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Breed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,

    CONSTRAINT "Breed_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Species_name_key" ON "Species"("name");

-- AddForeignKey
ALTER TABLE "Breed" ADD CONSTRAINT "Breed_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "Species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "Breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
