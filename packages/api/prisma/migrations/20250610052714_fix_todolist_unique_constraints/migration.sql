/*
  Warnings:

  - A unique constraint covering the columns `[userId,name]` on the table `TodoList` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TodoList_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "TodoList_userId_name_key" ON "TodoList"("userId", "name");
