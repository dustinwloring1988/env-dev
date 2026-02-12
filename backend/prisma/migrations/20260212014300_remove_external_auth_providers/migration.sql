/*
  Warnings:

  - You are about to drop the column `allowedDomains` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `authConfig` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `authProvider` on the `App` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_App" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "apiKey" TEXT NOT NULL,
    "requireAuth" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    CONSTRAINT "App_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_App" ("apiKey", "createdAt", "description", "id", "name", "requireAuth", "updatedAt", "userId") SELECT "apiKey", "createdAt", "description", "id", "name", "requireAuth", "updatedAt", "userId" FROM "App";
DROP TABLE "App";
ALTER TABLE "new_App" RENAME TO "App";
CREATE UNIQUE INDEX "App_apiKey_key" ON "App"("apiKey");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
