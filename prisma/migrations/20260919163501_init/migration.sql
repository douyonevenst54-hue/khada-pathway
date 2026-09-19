-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "pathwayId" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'ht',
    "zip" TEXT NOT NULL,
    "answers" JSONB NOT NULL,
    "planKeys" TEXT[],
    "contact" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StepStatus" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "stepKey" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "note" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StepStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FollowUp" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "dueAt" TIMESTAMP(3) NOT NULL,
    "doneAt" TIMESTAMP(3),
    "outcome" TEXT,

    CONSTRAINT "FollowUp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Session_pathwayId_createdAt_idx" ON "Session"("pathwayId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StepStatus_sessionId_stepKey_key" ON "StepStatus"("sessionId", "stepKey");

-- CreateIndex
CREATE INDEX "FollowUp_dueAt_idx" ON "FollowUp"("dueAt");

-- AddForeignKey
ALTER TABLE "StepStatus" ADD CONSTRAINT "StepStatus_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "Session"("id") ON DELETE CASCADE ON UPDATE CASCADE;
