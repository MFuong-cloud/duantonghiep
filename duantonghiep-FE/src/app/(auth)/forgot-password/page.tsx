import ForgotPasswordForm from "@/app/(auth)/forgot-password/forgot-password-form";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
    return (
        <div className="flex min-h-screen">
            {/* Left side - Image & Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black overflow-hidden group">
                <Image
                    src="/image/d94480de46eedaf9391d4aadf5406c67.jpg"
                    alt="Forgot Password Background"
                    fill
                    className="object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-black/50 to-transparent" />


            {/* Right side - Form */}
            <div className="flex-1 flex flex-col items-center justify-center p-4 lg:p-12 relative bg-gray-50 dark:bg-[#121212]">
                {/* Back Button */}
                <div className="absolute top-6 left-6 lg:left-12 z-20">
                    <Link href="/">
                        <Button variant="ghost" className="gap-2 text-muted-foreground hover:text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/30 transition-colors">
                            <ArrowLeft className="w-4 h-4" />
                            Trang chủ
                        </Button>
                    </Link>
                </div>

                <div className="w-full max-w-md animate-in fade-in zoom-in-95 duration-500 relative z-10">
                    <ForgotPasswordForm />
                </div>

                {/* Footer decorations */}
                <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400" />
            </div>
        </div>
    );
}
