import {ToggleTheme} from "@/components/toggle-theme";
import Link from "next/link";
import { Croissant } from "lucide-react";

export default function Header() {
    return (
        <header className='border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60'>
            <div className="container mx-auto px-6 lg:px-10">
                <div className="flex h-16 items-center justify-between">

                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="rounded-full bg-gradient-to-br from-amber-400 to-orange-500 p-2 transition-transform group-hover:scale-110">
                            <Croissant className="h-6 w-6 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                            Booking Table
                        </span>
                    </Link>

                    <nav className="flex items-center gap-2">
                        <Link href="/login"
                            className="px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground hover:bg-accent rounded-md">
                            Đăng nhập
                        </Link>

                        <Link href="/register"
                            className="px-4 py-2 text-sm font-medium bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-md shadow-sm hover:shadow-md transition-all hover:from-amber-600 hover:to-orange-600">
                            Đăng ký
                        </Link>

                        <div className="ml-2 pl-2 border-l">
                            <ToggleTheme />
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
