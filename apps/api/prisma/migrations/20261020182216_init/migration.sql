-- CreateEnum
CREATE TYPE "role" AS ENUM ('organiser', 'buyer');

-- CreateEnum
CREATE TYPE "order_status" AS ENUM ('pending', 'paid', 'cancelled');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "role" NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "venue" TEXT NOT NULL,
    "starts_at" TIMESTAMPTZ NOT NULL,
    "organiser_id" INTEGER NOT NULL,

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seats" (
    "id" SERIAL NOT NULL,
    "row" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "price_paise" INTEGER NOT NULL,
    "event_id" INTEGER NOT NULL,

    CONSTRAINT "seats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holds" (
    "id" SERIAL NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "user_id" INTEGER NOT NULL,
    "expires_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "orders" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "status" "order_status" NOT NULL,
    "total_paise" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tickets" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "seat_id" INTEGER NOT NULL,
    "code" TEXT NOT NULL,

    CONSTRAINT "tickets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "seats_event_id_row_number_key" ON "seats"("event_id", "row", "number");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_seat_id_key" ON "tickets"("seat_id");

-- CreateIndex
CREATE UNIQUE INDEX "tickets_code_key" ON "tickets"("code");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_organiser_id_fkey" FOREIGN KEY ("organiser_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seats" ADD CONSTRAINT "seats_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holds" ADD CONSTRAINT "holds_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "holds" ADD CONSTRAINT "holds_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_seat_id_fkey" FOREIGN KEY ("seat_id") REFERENCES "seats"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Emails are stored lowercased by the app; the database enforces it so no code path can create a duplicate.
ALTER TABLE users ADD CONSTRAINT user_email_lowercase CHECK (email = lower(email));
