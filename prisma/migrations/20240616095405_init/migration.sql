/*
  Warnings:

  - You are about to drop the column `family_name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `given_name` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `lastName` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `nickname` on the `Admin` table. All the data in the column will be lost.
  - You are about to drop the column `updated_at` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `name` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "family_name",
DROP COLUMN "given_name",
DROP COLUMN "lastName",
DROP COLUMN "nickname",
DROP COLUMN "updated_at",
ADD COLUMN     "name" TEXT NOT NULL;
