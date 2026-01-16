/**
 * Soft Delete Utilities
 * Helper functions for managing soft delete operations
 */

import { db } from "@/db";
import { eq, and, isNull } from "drizzle-orm";

/**
 * Soft delete a record by setting deleted_at timestamp
 */
export async function softDelete<T extends { id: string; deleted_at?: Date | null }>(
  table: any,
  id: string
) {
  const result = await db
    .update(table)
    .set({ 
      deleted_at: new Date(),
      updated_at: new Date() 
    })
    .where(eq(table.id, id))
    .returning();

  return result[0];
}

/**
 * Restore a soft deleted record
 */
export async function restoreSoftDeleted<T extends { id: string; deleted_at?: Date | null }>(
  table: any,
  id: string
) {
  const result = await db
    .update(table)
    .set({ 
      deleted_at: null,
      updated_at: new Date() 
    })
    .where(eq(table.id, id))
    .returning();

  return result[0];
}

/**
 * Permanently delete a soft deleted record (hard delete)
 * Only works on records that are already soft deleted
 */
export async function permanentlyDelete(table: any, id: string) {
  const result = await db
    .delete(table)
    .where(eq(table.id, id))
    .returning() as any[];

  return result[0];
}

/**
 * Check if a record exists and is not soft deleted
 */
export async function findActiveById<T>(table: any, id: string) {
  const result = await db
    .select()
    .from(table)
    .where(and(eq(table.id, id), isNull(table.deleted_at)));

  return result[0];
}

/**
 * Build condition to exclude soft deleted records
 * Use this in WHERE clauses
 */
export function excludeSoftDeleted(table: any) {
  return isNull(table.deleted_at);
}
