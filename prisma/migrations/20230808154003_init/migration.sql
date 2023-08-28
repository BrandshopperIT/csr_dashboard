-- CreateTable
CREATE TABLE "Reps" (
    "id" SERIAL NOT NULL,
    "rep_name" TEXT,
    "initials" TEXT,
    "active" BOOLEAN,
    "email" TEXT,

    CONSTRAINT "Reps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UnresOA" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "order" TEXT,
    "last_audit" TEXT,
    "date" TEXT,
    "date_submitted" TEXT,
    "refund_amount" TEXT,
    "source" TEXT,
    "repId" INTEGER,
    "ord_balance" TEXT,
    "denial_reason_error_issue" TEXT,
    "auditorId" INTEGER,
    "date_reviewed" TEXT,
    "reptwoId" INTEGER,
    "corrected" BOOLEAN,
    "resub" BOOLEAN,
    "correction_comments" TEXT,
    "disabled" BOOLEAN NOT NULL,
    "disabled_by" INTEGER,

    CONSTRAINT "UnresOA_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReplacementSent" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "reqdate" TEXT,
    "ordernumber" TEXT,
    "replacement" BOOLEAN,
    "refund" BOOLEAN,
    "trackinginfo" TEXT,
    "requestedbyId" INTEGER,
    "notes" TEXT,
    "trackingstatus" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "disabled_by" INTEGER,

    CONSTRAINT "ReplacementSent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RefundSheet" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "reqdate" TEXT,
    "ordernumber" TEXT,
    "refund_amount" TEXT,
    "source" TEXT,
    "requestedbyId" INTEGER,
    "date_refund" TEXT,
    "amount_refund" TEXT,
    "refundedbyId" INTEGER,
    "notes" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "disabled_by" INTEGER,

    CONSTRAINT "RefundSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CCSheet" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "reqdate" TEXT,
    "ordernumber" TEXT,
    "amountdue" TEXT,
    "channel" TEXT,
    "requestedbyId" INTEGER,
    "cardholdername" TEXT,
    "cardnum" TEXT,
    "expiration" TEXT,
    "cvc" TEXT,
    "authdate" TEXT,
    "processedbyid" INTEGER,
    "notes" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "disabled_by" INTEGER,

    CONSTRAINT "CCSheet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TracerReq" (
    "id" SERIAL NOT NULL,
    "status" TEXT,
    "reqdate" TEXT,
    "ordernum" TEXT,
    "therepId" INTEGER,
    "comments" TEXT,
    "odooresolved" BOOLEAN,
    "replacerefundok" TEXT,
    "comments2" TEXT,
    "claimsubmitted" TEXT,
    "submitId" INTEGER,
    "notes" TEXT,
    "disabled" BOOLEAN NOT NULL DEFAULT false,
    "disabled_by" INTEGER,

    CONSTRAINT "TracerReq_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "cc_password" TEXT,
    "admin" BOOLEAN NOT NULL,
    "rep_userid" INTEGER,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UnresOA" ADD CONSTRAINT "UnresOA_repId_fkey" FOREIGN KEY ("repId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnresOA" ADD CONSTRAINT "UnresOA_auditorId_fkey" FOREIGN KEY ("auditorId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UnresOA" ADD CONSTRAINT "UnresOA_reptwoId_fkey" FOREIGN KEY ("reptwoId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReplacementSent" ADD CONSTRAINT "ReplacementSent_requestedbyId_fkey" FOREIGN KEY ("requestedbyId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundSheet" ADD CONSTRAINT "RefundSheet_requestedbyId_fkey" FOREIGN KEY ("requestedbyId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RefundSheet" ADD CONSTRAINT "RefundSheet_refundedbyId_fkey" FOREIGN KEY ("refundedbyId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CCSheet" ADD CONSTRAINT "CCSheet_requestedbyId_fkey" FOREIGN KEY ("requestedbyId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CCSheet" ADD CONSTRAINT "CCSheet_processedbyid_fkey" FOREIGN KEY ("processedbyid") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracerReq" ADD CONSTRAINT "TracerReq_therepId_fkey" FOREIGN KEY ("therepId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TracerReq" ADD CONSTRAINT "TracerReq_submitId_fkey" FOREIGN KEY ("submitId") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Users" ADD CONSTRAINT "Users_rep_userid_fkey" FOREIGN KEY ("rep_userid") REFERENCES "Reps"("id") ON DELETE SET NULL ON UPDATE CASCADE;
