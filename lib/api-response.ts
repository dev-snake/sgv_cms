import { NextResponse } from "next/server";

export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta: any;
  error?: string;
}

/**
 * Standard API response helper
 */
export function apiResponse<T>(
  data: T,
  {
    status = 200,
    meta = {},
    success = true,
    error,
  }: {
    status?: number;
    meta?: any;
    success?: boolean;
    error?: string;
  } = {}
) {
  return NextResponse.json(
    {
      success,
      data,
      meta,
      ...(error && { error }),
    },
    { status }
  );
}

/**
 * Standard API error helper
 */
export function apiError(
  message: string,
  status: number = 400,
  data: any = null
) {
  return apiResponse(data, {
    success: false,
    error: message,
    status,
  });
}
