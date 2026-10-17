-- AlterTable
ALTER TABLE "LetterReview" ADD COLUMN "deadlineDate" DATE,
ADD COLUMN "deadlineNote" TEXT;

-- CreateTable
CREATE TABLE "Reminder" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reviewId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "lang" TEXT NOT NULL DEFAULT 'ht',
    "sender" TEXT NOT NULL,
    "deadline" DATE NOT NULL,
    "note" TEXT,
    "remindAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "sentAt" TIMESTAMP(3),
    "sentBy" TEXT,
    "outcome" TEXT,

    CONSTRAINT "Reminder_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Reminder_reviewId_kind_key" ON "Reminder"("reviewId", "kind");

-- CreateIndex
CREATE INDEX "Reminder_status_remindAt_idx" ON "Reminder"("status", "remindAt");
