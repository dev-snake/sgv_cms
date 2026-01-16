-- Migration: Add Indexes and Optimizations
-- Priority 1: Essential performance indexes

-- ===== SOFT DELETE COLUMNS =====
ALTER TABLE "news_articles" ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "products" ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "projects" ADD COLUMN "deleted_at" timestamp;
ALTER TABLE "job_postings" ADD COLUMN "deleted_at" timestamp;

-- ===== UPDATE CASCADE DELETE RULES =====
-- Drop existing foreign keys
ALTER TABLE "categories" DROP CONSTRAINT IF EXISTS "categories_category_type_id_category_types_id_fk";
ALTER TABLE "news_articles" DROP CONSTRAINT IF EXISTS "news_articles_category_id_categories_id_fk";
ALTER TABLE "news_articles" DROP CONSTRAINT IF EXISTS "news_articles_author_id_authors_id_fk";
ALTER TABLE "products" DROP CONSTRAINT IF EXISTS "products_category_id_categories_id_fk";
ALTER TABLE "projects" DROP CONSTRAINT IF EXISTS "projects_category_id_categories_id_fk";

-- Recreate with proper cascade rules
ALTER TABLE "categories" ADD CONSTRAINT "categories_category_type_id_category_types_id_fk" 
  FOREIGN KEY ("category_type_id") REFERENCES "category_types"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_category_id_categories_id_fk" 
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "news_articles" ADD CONSTRAINT "news_articles_author_id_authors_id_fk" 
  FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" 
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "projects" ADD CONSTRAINT "projects_category_id_categories_id_fk" 
  FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Make author_id nullable for news_articles (to support SET NULL)
ALTER TABLE "news_articles" ALTER COLUMN "author_id" DROP NOT NULL;

-- ===== FOREIGN KEY INDEXES (Critical for JOIN performance) =====
CREATE INDEX IF NOT EXISTS "idx_categories_type_id" ON "categories"("category_type_id");
CREATE INDEX IF NOT EXISTS "idx_news_category_id" ON "news_articles"("category_id");
CREATE INDEX IF NOT EXISTS "idx_news_author_id" ON "news_articles"("author_id");
CREATE INDEX IF NOT EXISTS "idx_products_category_id" ON "products"("category_id");
CREATE INDEX IF NOT EXISTS "idx_projects_category_id" ON "projects"("category_id");

-- ===== PRODUCTS INDEXES =====
CREATE INDEX IF NOT EXISTS "idx_products_status" ON "products"("status");
CREATE INDEX IF NOT EXISTS "idx_products_featured" ON "products"("is_featured") WHERE "is_featured" = true;
CREATE INDEX IF NOT EXISTS "idx_products_created_at" ON "products"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_products_deleted_at" ON "products"("deleted_at") WHERE "deleted_at" IS NULL;
CREATE INDEX IF NOT EXISTS "idx_products_status_featured" ON "products"("status", "is_featured");
CREATE INDEX IF NOT EXISTS "idx_products_category_status" ON "products"("category_id", "status");

-- ===== NEWS ARTICLES INDEXES =====
CREATE INDEX IF NOT EXISTS "idx_news_status" ON "news_articles"("status");
CREATE INDEX IF NOT EXISTS "idx_news_published_at" ON "news_articles"("published_at" DESC) WHERE "published_at" IS NOT NULL;
CREATE INDEX IF NOT EXISTS "idx_news_created_at" ON "news_articles"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_news_deleted_at" ON "news_articles"("deleted_at") WHERE "deleted_at" IS NULL;
CREATE INDEX IF NOT EXISTS "idx_news_status_published" ON "news_articles"("status", "published_at" DESC);

-- ===== PROJECTS INDEXES =====
CREATE INDEX IF NOT EXISTS "idx_projects_status" ON "projects"("status");
CREATE INDEX IF NOT EXISTS "idx_projects_created_at" ON "projects"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_projects_deleted_at" ON "projects"("deleted_at") WHERE "deleted_at" IS NULL;

-- ===== JOB POSTINGS INDEXES =====
CREATE INDEX IF NOT EXISTS "idx_jobs_status" ON "job_postings"("status");
CREATE INDEX IF NOT EXISTS "idx_jobs_deadline" ON "job_postings"("deadline") WHERE "status" = 'open';
CREATE INDEX IF NOT EXISTS "idx_jobs_employment_type" ON "job_postings"("employment_type");
CREATE INDEX IF NOT EXISTS "idx_jobs_created_at" ON "job_postings"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_jobs_deleted_at" ON "job_postings"("deleted_at") WHERE "deleted_at" IS NULL;

-- ===== CONTACTS INDEXES =====
CREATE INDEX IF NOT EXISTS "idx_contacts_status" ON "contacts"("status");
CREATE INDEX IF NOT EXISTS "idx_contacts_created_at" ON "contacts"("created_at" DESC);
CREATE INDEX IF NOT EXISTS "idx_contacts_email" ON "contacts"("email");

-- ===== MEDIA INDEXES =====
CREATE INDEX IF NOT EXISTS "idx_media_file_type" ON "media"("file_type");
CREATE INDEX IF NOT EXISTS "idx_media_uploaded_at" ON "media"("uploaded_at" DESC);

-- ===== USERS INDEXES =====
CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");

-- ===== COMMENTS =====
COMMENT ON COLUMN "news_articles"."deleted_at" IS 'Soft delete timestamp. NULL = active, NOT NULL = deleted';
COMMENT ON COLUMN "products"."deleted_at" IS 'Soft delete timestamp. NULL = active, NOT NULL = deleted';
COMMENT ON COLUMN "projects"."deleted_at" IS 'Soft delete timestamp. NULL = active, NOT NULL = deleted';
COMMENT ON COLUMN "job_postings"."deleted_at" IS 'Soft delete timestamp. NULL = active, NOT NULL = deleted';
