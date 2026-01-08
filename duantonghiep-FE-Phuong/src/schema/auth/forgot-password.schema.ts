import { z } from "zod";

export const ForgotPasswordBody = z
    .object({
        email: z.string().min(1, "Vui lòng nhập Email hoặc Số điện thoại"),
        provided_email: z.union([z.string().email("Email không hợp lệ"), z.literal("")]).optional(),
    })
    .strict();

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;

export const ResetPasswordBody = z
    .object({
        token: z.string().min(6, "Mã xác thực phải đủ 6 ký tự"),
        password: z
            .string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .refine(
                (val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val),
                { message: "Mật khẩu phải bao gồm số, chữ và 1 ký tự đặc biệt" }
            ),
        confirmPassword: z.string(),
        phone: z.string().optional(),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
