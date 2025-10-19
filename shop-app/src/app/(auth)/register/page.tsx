import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
const formSchema = z.object({
    username: z.string().min(2).max(50),
})

import RegisterForm from "@/app/(auth)/register/register-form";
import Image from "next/image";

export default function RegisterPage() {
    return (
        <div className="min-h-screen flex">
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className='text-3xl font-bold mb-2'>Tạo tài khoản</h2>
                        <p className="text-muted-foreground">Đăng ký để bắt đầu đặt bàn</p>
                    </div>
                    <RegisterForm />
                </div>
            </div>
            
            <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 items-center justify-center p-12">
                <Image 
                    src="/image/banner-register.png" 
                    alt="register" 
                    width={800} 
                    height={800}
                    className="w-full max-w-lg h-auto drop-shadow-2xl"
                />
            </div>
        </div>
    )
}
