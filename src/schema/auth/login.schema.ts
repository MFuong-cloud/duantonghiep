import z from "zod";

export const LoginBody = z
    .object({
        emailOrPhoneNumber: z.string()
            .refine(
                (val) =>
                    z.string().email().safeParse(val).success ||
                    (/^\d{10}$/.test(val) && !isNaN(Number(val))),
                {
                    message: "Vui lòng nhập đúng định dạng email hoặc số điện thoại",
                }
            ),
        password: z.string()
            .min(8, "Mật khẩu phải có ít nhất 8 ký tự")
            .refine(
                (val) => /[a-zA-Z]/.test(val) && /[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val),
                { message: "Mật khẩu phải bao gồm số, chữ và 1 ký tự đặc biệt" }
            ),
    })
    .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>
