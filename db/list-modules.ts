import 'dotenv/config';
import { db } from './index';
import { modules } from './schema';

async function listModules() {
    const all = await db.select().from(modules);
    console.log(JSON.stringify(all, null, 2));
    process.exit(0);
}

listModules().catch((err) => {
    console.error(err);
    process.exit(1);
});
