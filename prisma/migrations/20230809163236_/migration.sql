/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `UnresOA` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UnresOA_id_key" ON "UnresOA"("id");
