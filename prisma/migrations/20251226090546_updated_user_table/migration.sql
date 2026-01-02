-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'CUSTOMER');

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'CUSTOMER';
