import 'dotenv/config';
import { db } from './index';
import { categoryTypes, categories, authors, users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('Seeding database...');

  // 1. Seed Category Types
  const types = ['news', 'product', 'project'];
  for (const typeName of types) {
    const existing = await db.select().from(categoryTypes).where(eq(categoryTypes.name, typeName));
    if (existing.length === 0) {
      await db.insert(categoryTypes).values({ name: typeName });
      console.log(`Added category type: ${typeName}`);
    }
  }

  // Get types for reference
  const allTypes = await db.select().from(categoryTypes);
  const newsType = allTypes.find(t => t.name === 'news');
  const productType = allTypes.find(t => t.name === 'product');
  const projectType = allTypes.find(t => t.name === 'project');

  // 2. Seed Initial Categories
  if (newsType) {
    const newsCats = ['Tin tức chung', 'Sự kiện công ty', 'Kiến thức kỹ thuật'];
    for (const catName of newsCats) {
      await db.insert(categories).values({ name: catName, category_type_id: newsType.id });
    }
  }

  if (productType) {
    const productCats = ['Van Công Nghiệp', 'Thiết Bị Đo', 'Phụ kiện IoT'];
    for (const catName of productCats) {
      await db.insert(categories).values({ name: catName, category_type_id: productType.id });
    }
  }

  if (projectType) {
    const projectCats = ['Hệ Thống Cấp Nước', 'Xử Lý Nước Thải', 'Tự động hóa'];
    for (const catName of projectCats) {
      await db.insert(categories).values({ name: catName, category_type_id: projectType.id });
    }
  }

  // 3. Seed Default Author
  const existingAuthor = await db.select().from(authors).where(eq(authors.name, 'Admin'));
  if (existingAuthor.length === 0) {
    await db.insert(authors).values({ name: 'Admin', role: 'Administrator' });
    console.log('Added default author: Admin');
  }
  
  // 4. Seed Default User
  const existingUser = await db.select().from(users).where(eq(users.username, 'admin'));
  if (existingUser.length === 0) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.insert(users).values({ 
      username: 'admin', 
      password: hashedPassword,
      full_name: 'Administrator',
      role: 'admin'
    });
    console.log('Added default user: admin / admin123');
  }

  console.log('Seeding completed!');
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
