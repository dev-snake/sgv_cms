CREATE TYPE "public"."product_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."project_status" AS ENUM('ongoing', 'completed');--> statement-breakpoint
CREATE TYPE "public"."status" AS ENUM('draft', 'published');--> statement-breakpoint
CREATE TABLE "authors" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"role" varchar(255)
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"category_type_id" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "category_types" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT "category_types_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "media" (
	"id" serial PRIMARY KEY NOT NULL,
	"file_name" varchar(255) NOT NULL,
	"file_url" varchar(255) NOT NULL,
	"file_type" varchar(50),
	"file_size" bigint,
	"uploaded_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "news_articles" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"summary" text NOT NULL,
	"content" text NOT NULL,
	"category_id" integer NOT NULL,
	"author_id" integer NOT NULL,
	"status" "status" DEFAULT 'draft' NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "news_articles_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(12, 2) DEFAULT '0.00' NOT NULL,
	"sku" varchar(100) NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"category_id" integer NOT NULL,
	"status" "product_status" DEFAULT 'active' NOT NULL,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug"),
	CONSTRAINT "products_sku_unique" UNIQUE("sku")
);
--> statement-breakpoint
CREATE TABLE "projects" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"client_name" varchar(255),
	"start_date" timestamp,
	"end_date" timestamp,
	"category_id" integer NOT NULL,
	"status" "project_status" DEFAULT 'ongoing' NOT NULL,
	"image_url" varchar(255),
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_category_type_id_category_types_id_fk" FOREIGN KEY ("category_type_id") REFERENCES "public"."category_types"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_author_id_authors_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;