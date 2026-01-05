import { z } from "zod";

export const ForgotPasswordBody = z
    .object({
        email: z.string().email("Vui lòng nhập đúng định dạng email"),
    })
    .strict();

export type ForgotPasswordBodyType = z.infer<typeof ForgotPasswordBody>;

export const ResetPasswordBody = z
    .object({
        token: z.string().min(1, "Mã xác thực không được để trống"),
        password: z
            .string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .refine(
                (val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val),
                { message: "Mật khẩu phải bao gồm số, chữ và 1 ký tự đặc biệt" }
            ),
        confirmPassword: z.string(),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
        message: "Mật khẩu xác nhận không khớp",
        path: ["confirmPassword"],
    });

export type ResetPasswordBodyType = z.infer<typeof ResetPasswordBody>;
