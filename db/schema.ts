import { pgTable, varchar, text, timestamp, decimal, integer, pgEnum, bigint, uuid } from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('status', ['draft', 'published']);
export const productStatusEnum = pgEnum('product_status', ['active', 'inactive']);
export const projectStatusEnum = pgEnum('project_status', ['ongoing', 'completed']);

export const categoryTypes = pgTable('category_types', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull().unique(), // news, product, project
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  category_type_id: uuid('category_type_id').references(() => categoryTypes.id).notNull(),
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
  category_id: uuid('category_id').references(() => categories.id).notNull(),
  author_id: uuid('author_id').references(() => authors.id).notNull(),
  status: statusEnum('status').default('draft').notNull(),
  published_at: timestamp('published_at'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const products = pgTable('products', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull().default('0.00'),
  sku: varchar('sku', { length: 100 }).notNull().unique(),
  stock: integer('stock').notNull().default(0),
  category_id: uuid('category_id').references(() => categories.id).notNull(),
  status: productStatusEnum('status').default('active').notNull(),
  image_url: varchar('image_url', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
});

export const projects = pgTable('projects', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: varchar('name', { length: 255 }).notNull(),
  slug: varchar('slug', { length: 255 }).notNull().unique(),
  description: text('description').notNull(),
  client_name: varchar('client_name', { length: 255 }),
  start_date: timestamp('start_date'),
  end_date: timestamp('end_date'),
  category_id: uuid('category_id').references(() => categories.id).notNull(),
  status: projectStatusEnum('status').default('ongoing').notNull(),
  image_url: varchar('image_url', { length: 255 }),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
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

