import { z } from "zod";

export const jobApplicationSchema = z.object({
  job_id: z.string().uuid("ID công việc không hợp lệ"),
  full_name: z.string().min(1, "Họ tên là bắt buộc").max(255),
  email: z.string().email("Email không hợp lệ"),
  phone: z.string().min(10, "Số điện thoại không hợp lệ").max(20),
  cv_url: z.string().min(1, "Vui lòng đính kèm CV"),
  cover_letter: z.string().optional().nullable(),
});

export type JobApplicationInput = z.infer<typeof jobApplicationSchema>;
