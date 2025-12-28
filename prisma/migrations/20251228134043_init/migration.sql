-- CreateTable
CREATE TABLE "parents" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "firstName" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "classes" TEXT,
    "email" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "lots" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "icon" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "ownerId" TEXT NOT NULL,
    "reservedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "lots_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "parents" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "lots_reservedById_fkey" FOREIGN KEY ("reservedById") REFERENCES "parents" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "parents_email_key" ON "parents"("email");

-- CreateIndex
CREATE INDEX "lots_ownerId_idx" ON "lots"("ownerId");

-- CreateIndex
CREATE INDEX "lots_reservedById_idx" ON "lots"("reservedById");

-- CreateIndex
CREATE INDEX "lots_status_idx" ON "lots"("status");
