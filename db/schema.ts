import { pgTable, varchar, text, timestamp, decimal, integer, pgEnum, bigint, uuid, boolean, jsonb } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['draft', 'published']);
export const productStatusEnum = pgEnum('product_status', ['active', 'inactive']);
export const projectStatusEnum = pgEnum('project_status', ['ongoing', 'completed']);
export const jobStatusEnum = pgEnum('job_status', ['open', 'closed']);
export const employmentTypeEnum = pgEnum('employment_type', ['full_time', 'part_time', 'contract', 'internship']);

export const categoryTypes = pgTable('category_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(), // news, product, project
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  category_type_id: uuid('category_type_id').references(() => categoryTypes.id, { onDelete: 'restrict' }).notNull(),
});

export const authors = pgTable('authors', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  role: varchar('role', { length: 255 }),
});

export const newsArticles = pgTable('news_articles', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  summary: text('summary').notNull(),
  content: text('content').notNull(),
  category_id: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }).notNull(),
  author_id: uuid('author_id').references(() => authors.id, { onDelete: 'set null' }),
  status: statusEnum('status').default('draft').notNull(),
  image_url: varchar('image_url', { length: 255 }),
  gallery: jsonb('gallery'), // Array of image URLs
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'), // Soft delete
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  stock: integer('stock').notNull().default(0),
  category_id: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }).notNull(),
  status: productStatusEnum('status').default('active').notNull(),
  image_url: varchar('image_url', { length: 255 }),
  
  // New Enhanced Fields
  is_featured: boolean('is_featured').default(false).notNull(),
  tech_specs: jsonb('tech_specs'), // JSON format for flexible specifications
  features: jsonb('features'), // Array of highlighting features
  gallery: jsonb('gallery'), // Array of image URLs
  tech_summary: text('tech_summary'),
  catalog_url: varchar('catalog_url', { length: 255 }),
  warranty: varchar('warranty', { length: 100 }),
  origin: varchar('origin', { length: 255 }),
  availability: varchar('availability', { length: 255 }),
  delivery_info: varchar('delivery_info', { length: 255 }),
  
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'), // Soft delete
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  client_name: varchar('client_name', { length: 255 }),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  category_id: uuid('category_id').references(() => categories.id, { onDelete: 'restrict' }).notNull(),
  status: projectStatusEnum('status').default('ongoing').notNull(),
  image_url: varchar('image_url', { length: 255 }),
  gallery: jsonb('gallery'), // Array of image URLs
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'), // Soft delete
});

export const media = pgTable('media', {
  id: uuid('id').primaryKey().defaultRandom(),
  file_name: varchar('file_name', { length: 255 }).notNull(),
  file_url: varchar('file_url', { length: 255 }).notNull(),
  file_type: varchar('file_type', { length: 50 }), // image, document, etc.
  file_size: bigint('file_size', { mode: 'number' }),
  uploaded_at: timestamp('uploaded_at').defaultNow().notNull(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  username: varchar('username', { length: 255 }).notNull().unique(),
  password: text('password').notNull(),
  full_name: varchar('full_name', { length: 255 }),
  role: varchar('role', { length: 50 }).default('admin').notNull(),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  phone: varchar('phone', { length: 20 }),
  address: text('address'),
  subject: varchar('subject', { length: 255 }),
  message: text('message').notNull(),
  status: varchar('status', { length: 50 }).default('new').notNull(), // new, read, replied, archived
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

// Job Postings for Recruitment
export const jobPostings = pgTable('job_postings', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: varchar('title', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  requirements: text('requirements'), // Can be HTML or plain text
  benefits: text('benefits'), // Can be HTML or plain text
  location: varchar('location', { length: 255 }),
  employment_type: employmentTypeEnum('employment_type').default('full_time').notNull(),
  salary_range: varchar('salary_range', { length: 100 }), // e.g., "15-25 triệu VND"
  experience_level: varchar('experience_level', { length: 100 }), // e.g., "2-3 năm"
  department: varchar('department', { length: 255 }), // e.g., "Kỹ thuật", "Kinh doanh"
  status: jobStatusEnum('status').default('open').notNull(),
  deadline: timestamp('deadline'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'), // Soft delete
});
