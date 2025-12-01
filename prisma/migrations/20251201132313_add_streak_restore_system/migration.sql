-- AlterTable
ALTER TABLE "users" ADD COLUMN     "last_successful_day" TIMESTAMP(3),
ADD COLUMN     "restores_reset_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "restores_used_this_month" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "streak_restores" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "restored_date" TIMESTAMP(3) NOT NULL,
    "streak_at_restore" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "streak_restores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "streak_restores" ADD CONSTRAINT "streak_restores_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
