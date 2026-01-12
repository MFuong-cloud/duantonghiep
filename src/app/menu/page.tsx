import { Suspense } from "react";
import MenuPageContent from "./menu-content";

export default function MenuPage() {
    return (
        <Suspense fallback={
            <main className="bg-[#fffdf7] dark:bg-[#121212] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffb84d] mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải thực đơn...</p>
                </div>
            </main>
        }>
            <MenuPageContent />
        </Suspense>
    );
}
