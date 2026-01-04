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
CREATE TABLE "clients" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"tax_id" text,
	"email" text,
	"phone" text,
	"address" text,
	"notes" text,
	"onboarding_completed" boolean DEFAULT false NOT NULL,
	"created_by" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
ALTER TABLE "account_mappings" ADD CONSTRAINT "account_mappings_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "account_mappings" ADD CONSTRAINT "account_mappings_internal_account_id_chart_of_accounts_id_fk" FOREIGN KEY ("internal_account_id") REFERENCES "public"."chart_of_accounts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_created_by_user_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "unmapped_accounts" ADD CONSTRAINT "unmapped_accounts_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_mappings_client_idx" ON "account_mappings" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "account_mappings_client_code_idx" ON "account_mappings" USING btree ("client_id","client_account_code");--> statement-breakpoint
CREATE INDEX "unmapped_accounts_client_idx" ON "unmapped_accounts" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "unmapped_accounts_pending_idx" ON "unmapped_accounts" USING btree ("client_id","resolved");