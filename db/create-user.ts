import 'dotenv/config';
import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcryptjs';

async function createUser(username: string, pass: string, fullName: string) {
  try {
    const hashedPassword = await bcrypt.hash(pass, 10);
    await db.insert(users).values({
      username,
      password: hashedPassword,
      full_name: fullName,
      role: 'admin'
    });
    console.log(`Successfully created user: ${username}`);
  } catch (error) {
    console.error('Error creating user:', error);
  } finally {
    process.exit(0);
  }
}

// Create a test account
createUser('vinh_test', 'vinh123456', 'Vinh Test User');
