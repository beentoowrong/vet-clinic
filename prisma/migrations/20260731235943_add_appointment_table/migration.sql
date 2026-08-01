-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('IN_CLINIC', 'HOME_VISIT', 'TELECONSULTATION');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('WAITING_FOR_PAYMENT', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('UNPAID', 'PAID', 'EXPIRED', 'CANCELLED');

-- CreateTable
CREATE TABLE "appointments" (
    "id" SERIAL NOT NULL,
    "appointment_code" TEXT NOT NULL,
    "pet_id" INTEGER NOT NULL,
    "owner_id" INTEGER NOT NULL,
    "doctor_id" INTEGER NOT NULL,
    "appointment_date" DATE NOT NULL,
    "appointment_time" TEXT NOT NULL,
    "service_type" "ServiceType" NOT NULL DEFAULT 'IN_CLINIC',
    "appointment_status" "AppointmentStatus" NOT NULL DEFAULT 'CONFIRMED',
    "complaint" TEXT,
    "home_visit_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "appointments_appointment_code_key" ON "appointments"("appointment_code");

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_pet_id_fkey" FOREIGN KEY ("pet_id") REFERENCES "pets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "pet_owners"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_doctor_id_fkey" FOREIGN KEY ("doctor_id") REFERENCES "doctors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
