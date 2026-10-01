-- CreateEnum
CREATE TYPE "InvoiceType" AS ENUM ('DP_TRANSPORT', 'TREATMENT');

-- DropIndex
DROP INDEX "invoices_appointment_id_key";

-- AlterTable
ALTER TABLE "invoices" ADD COLUMN     "description" TEXT,
ADD COLUMN     "type" "InvoiceType" NOT NULL DEFAULT 'TREATMENT';
