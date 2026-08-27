-- Initial PostgreSQL schema for the DigitalOcean CorridaDB database.
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "email_confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "profiles" (
    "id" UUID NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone_e164" TEXT,
    "sex" TEXT,
    "birth_date" DATE,
    "avatar_path" TEXT,
    "profile_completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "profiles_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "events" (
    "id" UUID NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "event_date" DATE NOT NULL,
    "location" TEXT NOT NULL,
    "distance_km" DECIMAL(5,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'OPEN',
    "donation_instructions" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "registrations" (
    "id" UUID NOT NULL,
    "protocol" TEXT NOT NULL,
    "event_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "referral_source" TEXT NOT NULL,
    "referrer_name" TEXT,
    "shirt_size" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PRE_REGISTERED',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "registrations_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "consents" (
    "id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "consent_type" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "accepted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "consents_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");
CREATE UNIQUE INDEX "registrations_protocol_key" ON "registrations"("protocol");
CREATE INDEX "registrations_status_idx" ON "registrations"("status");
CREATE INDEX "registrations_user_id_idx" ON "registrations"("user_id");
CREATE INDEX "registrations_submitted_at_idx" ON "registrations"("submitted_at");
CREATE UNIQUE INDEX "registrations_event_id_user_id_key" ON "registrations"("event_id", "user_id");
CREATE UNIQUE INDEX "consents_user_id_consent_type_version_key" ON "consents"("user_id", "consent_type", "version");
ALTER TABLE "profiles" ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "registrations" ADD CONSTRAINT "registrations_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "consents" ADD CONSTRAINT "consents_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
INSERT INTO "events" ("id", "slug", "name", "event_date", "location", "distance_km", "status", "donation_instructions", "updated_at")
VALUES (gen_random_uuid(), 'passos-que-alimentam-2026', 'Corrida Passos que Alimentam', DATE '2026-11-28', 'Jardim de Alah, Salvador - BA', 5.00, 'OPEN', '2 kg de alimentos não perecíveis ou 1 lata de leite em pó', CURRENT_TIMESTAMP);
