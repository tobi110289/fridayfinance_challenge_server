/*
  Warnings:

  - You are about to drop the column `accountId` on the `Transaction` table. All the data in the column will be lost.
  - You are about to drop the column `categoryId` on the `Transaction` table. All the data in the column will be lost.
  - Added the required column `account_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `category_id` to the `Transaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "accountId",
DROP COLUMN "categoryId",
ADD COLUMN     "account_id" TEXT NOT NULL,
ADD COLUMN     "category_id" TEXT NOT NULL;
