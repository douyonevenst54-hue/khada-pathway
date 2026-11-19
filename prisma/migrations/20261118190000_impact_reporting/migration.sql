-- CreateTable
CREATE TABLE "Program" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Program_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "date" DATE NOT NULL,
    "programId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "peopleServed" INTEGER NOT NULL DEFAULT 0,
    "volunteerHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "staffHours" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "costCents" INTEGER NOT NULL DEFAULT 0,
    "inKindCents" INTEGER NOT NULL DEFAULT 0,
    "zip" TEXT,
    "lang" TEXT,
    "partner" TEXT,
    "note" TEXT,
    "loggedBy" TEXT NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Program_name_key" ON "Program"("name");

-- CreateIndex
CREATE INDEX "Activity_date_idx" ON "Activity"("date");

-- CreateIndex
CREATE INDEX "Activity_programId_date_idx" ON "Activity"("programId", "date");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_programId_fkey" FOREIGN KEY ("programId") REFERENCES "Program"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
