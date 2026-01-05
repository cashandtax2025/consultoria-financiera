CREATE TYPE "public"."client_company_type" AS ENUM('trader_no_stock', 'trader_with_stock', 'services', 'producer');--> statement-breakpoint
CREATE TYPE "public"."client_sector" AS ENUM('restaurants', 'hotels', 'travel_agencies', 'consulting_legal', 'marketing_advertising', 'real_estate', 'construction', 'agriculture', 'livestock', 'fishing', 'food_industry', 'manufacturing', 'ecommerce', 'transport', 'logistics', 'it_consulting', 'education', 'clinics', 'gyms', 'retail', 'professional_services', 'beauty_salons', 'bakeries', 'fruit_shops', 'supermarkets', 'butcher_shops', 'fish_shops', 'tobacco_shops', 'pharmacies', 'workshops');--> statement-breakpoint
CREATE TABLE "account_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"client_account_code" text NOT NULL,
	"client_account_name" text,
	"internal_account_id" uuid NOT NULL,
	"notes" text,
	"auto_mapped" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chart_of_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" text NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"level" integer NOT NULL,
	"parent_code" text,
	"type" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "chart_of_accounts_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "unmapped_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_id" uuid NOT NULL,
	"account_code" text NOT NULL,
	"account_name" text,
	"first_seen_at" timestamp DEFAULT now() NOT NULL,
	"occurrences" integer DEFAULT 1 NOT NULL,
	"source_document" text,
	"resolved" boolean DEFAULT false NOT NULL,
	"resolved_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	"impersonated_by" text,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean NOT NULL,
	"image" text,
	"created_at" timestamp NOT NULL,
	"updated_at" timestamp NOT NULL,
	"role" text DEFAULT 'user',
	"banned" boolean DEFAULT false,
	"ban_reason" text,
	"ban_expires" timestamp,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tax_id" text NOT NULL,
	"name" text NOT NULL,
	"sector" "client_sector" NOT NULL,
	"company_type" "client_company_type" NOT NULL,
	"group_id" uuid,
	"group_tax_id" text,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"address" text,
	"notes" text,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "clients_tax_id_unique" UNIQUE("tax_id"),
	CONSTRAINT "clients_group_tax_id_unique" UNIQUE("group_tax_id"),
	CONSTRAINT "clients_email_unique" UNIQUE("email"),
	CONSTRAINT "clients_phone_unique" UNIQUE("phone")
);
--> statement-breakpoint
CREATE TABLE "todo" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "data_schemas" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"document_type" text NOT NULL,
	"schema" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "extracted_data" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"upload_id" uuid NOT NULL,
	"schema_id" uuid,
	"document_type" text NOT NULL,
	"data" jsonb NOT NULL,
	"record_count" integer DEFAULT 0 NOT NULL,
	"validation_errors" jsonb,
	"extracted_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "financial_records" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"extracted_data_id" uuid NOT NULL,
	"upload_id" uuid NOT NULL,
	"record_type" text NOT NULL,
	"date" timestamp NOT NULL,
	"description" text,
	"amount" integer NOT NULL,
	"currency" text DEFAULT 'EUR',
	"invoice_number" text,
	"client_name" text,
	"vat_amount" integer,
	"total_amount" integer,
	"due_date" timestamp,
	"payment_status" text,
	"category" text,
	"supplier" text,
	"transaction_type" text,
	"balance" integer,
	"reference" text,
	"raw_data" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"filename" text NOT NULL,
	"file_type" text NOT NULL,
	"file_size" integer NOT NULL,
	"file_url" text,
	"client_name" text,
	"document_type" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"uploaded_at" timestamp DEFAULT now() NOT NULL,
	"processed_at" timestamp,
	"user_id" text NOT NULL,
	"error_message" text
);
--> statement-breakpoint
ALTER TABLE "account_mappings" ADD CONSTRAINT "account_mappings_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_mappings" ADD CONSTRAINT "account_mappings_internal_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("internal_account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unmapped_accounts" ADD CONSTRAINT "unmapped_accounts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extracted_data" ADD CONSTRAINT "extracted_data_upload_id_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."uploads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "extracted_data" ADD CONSTRAINT "extracted_data_schema_id_data_schemas_id_fk" FOREIGN KEY ("schema_id") REFERENCES "public"."data_schemas"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_records" ADD CONSTRAINT "financial_records_extracted_data_id_extracted_data_id_fk" FOREIGN KEY ("extracted_data_id") REFERENCES "public"."extracted_data"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "financial_records" ADD CONSTRAINT "financial_records_upload_id_uploads_id_fk" FOREIGN KEY ("upload_id") REFERENCES "public"."uploads"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_mappings_client_idx" ON "account_mappings" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "account_mappings_client_code_idx" ON "account_mappings" USING btree ("client_id","client_account_code");--> statement-breakpoint
CREATE INDEX "unmapped_accounts_client_idx" ON "unmapped_accounts" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "unmapped_accounts_pending_idx" ON "unmapped_accounts" USING btree ("client_id","resolved");