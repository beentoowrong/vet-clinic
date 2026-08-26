/*
  Warnings:

  - You are about to drop the `breed` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `medical_record` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `prescription` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "breed" DROP CONSTRAINT "breed_speciesId_fkey";

-- DropForeignKey
ALTER TABLE "medical_record" DROP CONSTRAINT "medical_record_appointment_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_record" DROP CONSTRAINT "medical_record_doctor_id_fkey";

-- DropForeignKey
ALTER TABLE "medical_record" DROP CONSTRAINT "medical_record_pet_id_fkey";

-- DropForeignKey
ALTER TABLE "pets" DROP CONSTRAINT "pets_breedId_fkey";

-- DropForeignKey
ALTER TABLE "prescription" DROP CONSTRAINT "prescription_medical_record_id_fkey";

-- DropTable
DROP TABLE "breed";

-- DropTable
DROP TABLE "medical_record";

-- DropTable
DROP TABLE "prescription";

-- CreateTable
CREATE TABLE "breeds" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "speciesId" INTEGER NOT NULL,

    CONSTRAINT "breeds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_records" (
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

    CONSTRAINT "medical_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prescriptions" (
    "id" SERIAL NOT NULL,
    "medical_record_id" INTEGER NOT NULL,
    "medicine_name" TEXT NOT NULL,
    "dosage" TEXT NOT NULL,
    "frequency" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prescriptions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_record_code_key" ON "medical_records"("record_code");

-- CreateIndex
CREATE UNIQUE INDEX "medical_records_appointment_id_key" ON "medical_records"("appointment_id");

-- AddForeignKey
ALTER TABLE "breeds" ADD CONSTRAINT "breeds_speciesId_fkey" FOREIGN KEY ("speciesId") REFERENCES "species"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_breedId_fkey" FOREIGN KEY ("breedId") REFERENCES "breeds"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_appointment_id_fkey" FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_records" ADD CONSTRAINT "medical_records_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prescriptions" ADD CONSTRAINT "prescriptions_medical_record_id_fkey" FOREIGN KEY ("medical_record_id") REFERENCES "medical_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;
