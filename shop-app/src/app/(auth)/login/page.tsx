import {z} from "zod"
import Image from "next/image";
import LoginForm from "./login-form";

const formSchema = z.object({
    username: z.string().min(2).max(50),
})

export default function LoginPage() {
    return (
        <div className="h-[calc(100vh-4rem)] flex">
            <div
                className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950 dark:to-orange-900 items-center justify-center p-12">
                <Image
                    src="/image/banner-register.png"
                    alt="register"
                    width={600}
                    height={600}
                    className="w-full max-w-lg h-auto drop-shadow-2xl"
                />
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <div className="mb-8">
                        <h2 className='text-3xl font-bold mb-2'>Đăng nhập</h2>
                        <p className="text-muted-foreground">Chào mừng bạn đã đến với Booking Table</p>
                    </div>
                    <LoginForm/>
                </div>
            </div>
        </div>
    )
}
