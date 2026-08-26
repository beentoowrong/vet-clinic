/*
  Warnings:

  - You are about to drop the `Breed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MedicalRecord` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Prescription` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Species` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Breed" DROP CONSTRAINT "Breed_speciesId_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "MedicalRecord" DROP CONSTRAINT "MedicalRecord_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "Prescription" DROP CONSTRAINT "Prescription_medical_record_id_fkey";

-- DropForeignKey
ALTER TABLE "pets" DROP CONSTRAINT "pets_breedId_fkey";

-- DropForeignKey
ALTER TABLE "pets" DROP CONSTRAINT "pets_speciesId_fkey";

-- DropTable
DROP TABLE "Breed";

-- DropTable
DROP TABLE "MedicalRecord";

-- DropTable
DROP TABLE "Prescription";

-- DropTable
DROP TABLE "Species";

-- CreateTable
CREATE TABLE "species" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "breed" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,

    CONSTRAINT "breed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_record" (
    "id" SERIAL NOT NULL,
    "record_code" TEXT NOT NULL,
    "appointment_id" INTEGER NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "weight_kg" DOUBLE PRECISION NOT NULL,
    "temperature_celcius" DOUBLE PRECISION NOT NULL,
    "symptoms" TEXT NOT NULL,
    "diagnosis" TEXT NOT NULL,
    "treatment" TEXT NOT NULL,
    "notes" TEXT,
    "follow_up_date" DATE,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "medical_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescription" (
    "id" SERIAL NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "medicine_name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "species_name_key" ON "species"("name");

-- CreateIndex
CREATE UNIQUE INDEX "medical_record_record_code_key" ON "medical_record"("record_code");

-- CreateIndex
CREATE UNIQUE INDEX "medical_record_appointment_id_key" ON "medical_record"("appointment_id");

-- AddForeignKey
ALTER TABLE "breed" ADD CONSTRAINT "breed_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "breed"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_record" ADD CONSTRAINT "medical_record_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescription" ADD CONSTRAINT "prescription_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "medical_record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
