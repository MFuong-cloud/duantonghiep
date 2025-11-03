import z from 'zod'

export const RegisterBody = z
    .object({
        name: z.string()
            .trim()
            .min(3, { message: "Tên không phù hợp" })
            .max(256, { message: "Tên không phù hợp" }),
        email: z.string().email({ message: "Email không hợp lệ" }),
        phoneNumber: z.string().min(8).max(10),
        password: z.string()
            .min(8, { message: "Mật khẩu phải có ít nhất 8 ký tự" })
            .max(100)
            .refine(
                (val) =>
                    /[a-zA-Z]/.test(val) &&               
                    /[0-9]/.test(val) &&                  
                    /[^a-zA-Z0-9]/.test(val),            
                {
                    message: "Mật khẩu không đủ mạnh, vui lòng nhập lại với 8 kí tự bao gồm số, chữ và 1 kí tự đặc biệt"
                }
            ),
        confirmPassword: z.string().min(8, { message: "Xảy ra lỗi, vui lòng nhập lại" }).max(100)
    })
    .strict()
    .superRefine(({ confirmPassword, password }, ctx) => {
        if (confirmPassword !== password) {
            ctx.addIssue({
                code: 'custom',
                message: 'Mật khẩu không khớp',
                path: ['confirmPassword']
            })
        }
    })

export type RegisterBodyType = z.TypeOf<typeof RegisterBody>

export const RegisterRes = z.object({
    data: z.object({
        token: z.string(),
        expiresAt: z.string(),
        account: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string()
        })
    }),
    message: z.string()
})

export type RegisterResType = z.TypeOf<typeof RegisterRes>

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

export const LoginRes = RegisterRes

export type LoginResType = z.TypeOf<typeof LoginRes>
export const SlideSessionBody = z.object({}).strict()

export type SlideSessionBodyType = z.TypeOf<typeof SlideSessionBody>
export const SlideSessionRes = RegisterRes

export type SlideSessionResType = z.TypeOf<typeof SlideSessionRes>
