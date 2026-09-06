/*
  Warnings:

  - A unique constraint covering the columns `[name,speciesId]` on the table `breeds` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `created_by` to the `pets` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "created_by" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "breeds_name_speciesId_key" ON "breeds"("name", "speciesId");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
