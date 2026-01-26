/*
  Warnings:

  - You are about to drop the column `VariantValue` on the `ProductVariants` table. All the data in the column will be lost.
  - Added the required column `variantValue` to the `ProductVariants` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductVariants" DROP COLUMN "VariantValue",
ADD COLUMN     "variantValue" VARCHAR(50) NOT NULL;
