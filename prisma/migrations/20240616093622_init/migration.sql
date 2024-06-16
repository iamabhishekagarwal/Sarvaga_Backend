/*
  Warnings:

  - You are about to drop the column `firstName` on the `Admin` table. All the data in the column will be lost.
  - Added the required column `email` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `family_name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `given_name` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nickname` to the `Admin` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `Admin` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Admin" DROP COLUMN "firstName",
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "family_name" TEXT NOT NULL,
ADD COLUMN     "given_name" TEXT NOT NULL,
ADD COLUMN     "nickname" TEXT NOT NULL,
ADD COLUMN     "updated_at" TEXT NOT NULL;
