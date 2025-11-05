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
        password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    })
    .strict()

export type LoginBodyType = z.TypeOf<typeof LoginBody>
