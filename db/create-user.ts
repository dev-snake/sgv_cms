import 'dotenv/config';
import { db } from './index';
import { users } from './schema';
import bcrypt from 'bcryptjs';
import { AUTH } from '@/constants/app';

async function createUser(username: string, pass: string, fullName: string) {
  try {
    const hashedPassword = await bcrypt.hash(pass, AUTH.BCRYPT_SALT_ROUNDS);
    await db.insert(users).values({
      username,
      password: hashedPassword,
      full_name: fullName,
      role: AUTH.DEFAULT_ROLE
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
