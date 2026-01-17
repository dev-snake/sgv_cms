import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, readdir, stat } from "fs/promises";
import path from "path";
import { apiResponse, apiError } from "@/utils/api-response";
import { withAuth } from "@/middlewares/middleware";
import { PERMISSIONS } from "@/constants/rbac";
import { UPLOAD } from "@/constants/app";

// GET /api/upload - List all uploaded images (recursively)
export const GET = withAuth(async (request: NextRequest) => {
  try {
    const baseDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(baseDir, { recursive: true });

    const getAllFiles = async (dirPath: string): Promise<any[]> => {
      const files = await readdir(dirPath);
      let results: any[] = [];

      for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const fileStat = await stat(fullPath);

        if (fileStat.isDirectory()) {
          const nested = await getAllFiles(fullPath);
          results = results.concat(nested);
        } else {
          const relativePublic = path.relative(path.join(process.cwd(), "public"), fullPath);
          const relativeFromUploads = path.relative(path.join(process.cwd(), "public", "uploads"), fullPath);
          const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif", ".pdf", ".doc", ".docx"];
          if (allowedExtensions.some(ext => file.toLowerCase().endsWith(ext))) {
            results.push({
              filename: relativeFromUploads,
              url: `/${relativePublic}`,
              size: fileStat.size,
              createdAt: fileStat.birthtime,
            });
          }
        }
      }
      return results;
    };

    const images = await getAllFiles(baseDir);
    images.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    
    return apiResponse(images);
  } catch (error) {
    console.error("Error listing uploads:", error);
    return apiError("Failed to list uploads", 500);
  }
}, { requiredPermissions: [PERMISSIONS.MEDIA_READ] });

export const POST = withAuth(async (request: NextRequest) => {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return apiError("No file uploaded", 400);
    }

    // Validate file type
    const isImage = file.type.startsWith("image/");
    const isDoc = UPLOAD.ALLOWED_DOC_TYPES.includes(file.type);

    if (!isImage && !isDoc) {
      return apiError("Định dạng file không hỗ trợ. Chỉ chấp nhận ảnh (JPG, PNG, WebP, GIF) và tài liệu (PDF, DOC, DOCX)", 400);
    }

    // Validate file size
    if (file.size > UPLOAD.MAX_FILE_SIZE) {
      return apiError(`File size exceeds ${UPLOAD.MAX_FILE_SIZE_MB}MB limit`, 400);
    }

    // Determine target directory
    const category = isDoc ? "cvs" : "images";
    const year = new Date().getFullYear().toString();
    const uploadsDir = path.join(process.cwd(), "public", "uploads", category, year);
    await mkdir(uploadsDir, { recursive: true });

    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const extension = file.name.split(".").pop() || (isImage ? "jpg" : "pdf");
    const filename = `${timestamp}-${randomSuffix}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Write file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filepath, buffer);

    // Return public URL
    const publicUrl = `/uploads/${category}/${year}/${filename}`;

    return apiResponse({ url: publicUrl, filename }, { status: 201 });
  } catch (error) {
    console.error("Error uploading file:", error);
    return apiError("Failed to upload file", 500);
  }
}, { requiredPermissions: [PERMISSIONS.MEDIA_WRITE] });

// DELETE /api/upload - Delete an uploaded file
export const DELETE = withAuth(async (request: NextRequest) => {
  try {
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get("filename");

    if (!filename) {
      return apiError("Filename is required", 400);
    }

    // Prevent path traversal attacks
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const filepath = path.join(uploadsDir, filename);

    // Security check: Ensure the resolved path is inside the uploads directory
    if (!filepath.startsWith(uploadsDir)) {
      return apiError("Invalid filename", 400);
    }

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
}, { requiredPermissions: [PERMISSIONS.MEDIA_DELETE] });
