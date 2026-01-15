import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";
import { apiResponse, apiError } from "@/utils/api-response";

// GET /api/upload - List all uploaded images
export async function GET(request: NextRequest) {
  try {
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    
    // Create directory if it doesn't exist
    await mkdir(uploadsDir, { recursive: true });
    
    const files = await readdir(uploadsDir);
    
    // Filter for image files and get their info
    const imageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    const images = await Promise.all(
      files
        .filter(file => imageExtensions.some(ext => file.toLowerCase().endsWith(ext)))
        .map(async (filename) => {
          const filepath = path.join(uploadsDir, filename);
          const fileStat = await stat(filepath);
          return {
            filename,
            url: `/uploads/${filename}`,
            size: fileStat.size,
            createdAt: fileStat.birthtime,
          };
        })
    );
    
    // Sort by creation date (newest first)
    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return apiResponse(images);
  } catch (error) {
    console.error("Error listing uploads:", error);
    return apiError("Failed to list uploads", 500);
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file uploaded", 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return apiError("Invalid file type. Allowed: JPEG, PNG, WebP, GIF", 400);
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return apiError("File size exceeds 5MB limit", 400);
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop() || "jpg";
    const filename = `${timestamp}-${randomSuffix}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${filename}`;

    return apiResponse({ url: publicUrl, filename }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return apiError("Failed to upload file", 500);
  }
}

// DELETE /api/upload - Delete an uploaded file
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return apiError("Filename is required", 400);
    }

    // Prevent path traversal attacks
    const safeName = path.basename(filename);
    const filepath = path.join(process.cwd(), "public", "uploads", safeName);

    const { unlink } = await import("fs/promises");
    await unlink(filepath);

    return apiResponse({ message: "File deleted successfully" });
  } catch (error: any) {
    if (error.code === "ENOENT") {
      return apiError("File not found", 404);
    }
    console.error("Error deleting file:", error);
    return apiError("Failed to delete file", 500);
  }
}
