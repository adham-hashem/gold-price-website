CREATE SCHEMA "gold_app";
--> statement-breakpoint
CREATE TABLE "gold_app"."articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"content" text NOT NULL,
	"meta_description" varchar(255),
	"category" varchar(100) DEFAULT 'general',
	"published_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone,
	"is_published" boolean DEFAULT false,
	"show_prices" boolean DEFAULT false,
	"price_24" double precision,
	"price_21" double precision,
	"price_18" double precision,
	"price_14" double precision,
	"price_gold_pound" double precision,
	CONSTRAINT "articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "gold_app"."articles" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gold_app"."login_attempts" (
	"key" varchar(64) PRIMARY KEY NOT NULL,
	"attempts" integer DEFAULT 1 NOT NULL,
	"expires_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
ALTER TABLE "gold_app"."login_attempts" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gold_app"."price_history" (
	"id" serial PRIMARY KEY NOT NULL,
	"karat_24" double precision,
	"karat_21" double precision,
	"karat_18" double precision,
	"ounce_usd" double precision,
	"timestamp" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "gold_app"."price_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "gold_app"."settings" (
	"id" serial PRIMARY KEY NOT NULL,
	"key" varchar(255) NOT NULL,
	"value" varchar(255) NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "settings_key_unique" UNIQUE("key")
);
--> statement-breakpoint
ALTER TABLE "gold_app"."settings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE INDEX "articles_published_idx" ON "gold_app"."articles" USING btree ("is_published","published_at");--> statement-breakpoint
CREATE INDEX "login_attempts_expiry_idx" ON "gold_app"."login_attempts" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "price_history_timestamp_idx" ON "gold_app"."price_history" USING btree ("timestamp");