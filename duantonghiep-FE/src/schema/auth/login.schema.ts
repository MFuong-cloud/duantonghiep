import { z } from "zod";

export const ForgotPasswordBody = z.object({
    email: z.string().min(1, "Email hoặc số điện thoại không được để trống"),
    provided_email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
});

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;

export const ResetPasswordBody = z.object({
    token: z.string().length(6, "Mã xác thực phải có 6 chữ số"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Mật khẩu xác nhận phải có ít nhất 6 ký tự"),
    phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
