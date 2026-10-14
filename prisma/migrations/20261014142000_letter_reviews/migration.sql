-- CreateTable
CREATE TABLE "LetterReview" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lang" TEXT NOT NULL DEFAULT 'ht',
    "sender" TEXT NOT NULL,
    "letterType" TEXT NOT NULL,
    "urgency" TEXT NOT NULL,
    "deadline" TEXT,
    "summaryEn" TEXT NOT NULL,
    "summaryHt" TEXT NOT NULL,
    "nextSteps" JSONB NOT NULL,
    "unclear" BOOLEAN NOT NULL DEFAULT false,
    "redFlag" BOOLEAN NOT NULL DEFAULT false,
    "contact" TEXT,
    "status" TEXT NOT NULL DEFAULT 'open',
    "reviewedAt" TIMESTAMP(3),
    "reviewedBy" TEXT,
    "reviewNote" TEXT,

    CONSTRAINT "LetterReview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LetterReview_status_createdAt_idx" ON "LetterReview"("status", "createdAt");
