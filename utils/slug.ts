/**
 * Generate a URL-friendly slug from a given text string.
 * Handles Vietnamese characters, normalizes Unicode, and formats for URLs.
 * 
 * @param text - The input string to convert to a slug
 * @returns A clean, URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}
