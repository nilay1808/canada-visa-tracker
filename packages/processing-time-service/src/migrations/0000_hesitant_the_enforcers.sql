CREATE TABLE IF NOT EXISTS "processing_times" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"published_at" date NOT NULL,
	"country_code" text NOT NULL,
	"visa_type" text NOT NULL,
	"estimate_time" text NOT NULL,
	CONSTRAINT "processing_times_country_code_visa_type_published_at_unique" UNIQUE("country_code","visa_type","published_at")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "country_code_visa_type_idx" ON "processing_times" ("country_code","visa_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "visa_type_published_at_idx" ON "processing_times" ("visa_type","published_at");