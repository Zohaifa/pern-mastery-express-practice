/*
  Warnings:

  - You are about to drop the column `display_order` on the `ProductImages` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductImages" DROP COLUMN "display_order",
ADD COLUMN     "displayOrder" INTEGER NOT NULL DEFAULT 0;
