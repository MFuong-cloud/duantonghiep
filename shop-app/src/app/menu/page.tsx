import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import AppPromoSection from "@/components/aboutSection/page";

const menuCategories = [
    { name: "Món khai vị", href: "/menu/appetizers", image: "/image/menu/appetizer.jpg" },
    { name: "Món chính", href: "/menu/main-courses", image: "/image/menu/main-course.jpg" },
    { name: "Món tráng miệng", href: "/menu/desserts", image: "/image/menu/dessert.jpg" },
    { name: "Đồ uống", href: "/menu/drinks", image: "/image/menu/drinks.jpg" },
    { name: "Món chay", href: "/menu/vegetarian", image: "/image/menu/vegetarian.jpg" },
    { name: "Ưu đãi đặc biệt", href: "/menu/specials", image: "/image/menu/specials.jpg" },
];

export default function MenuPage() {
    return (
        <main className="container mx-auto px-6 lg:px-10 py-16">
            <div className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">
                    Khám phá Thực đơn
                </h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                    Tận hưởng hương vị tinh tế từ những món ăn được chế biến bởi các đầu bếp hàng đầu.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 mb-20">
                {menuCategories.map((category) => (
                    <Link href={category.href} key={category.name} legacyBehavior>
                        <a className="group block rounded-2xl overflow-hidden relative shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:shadow-[0_8px_25px_rgba(0,0,0,0.25)] transition-all duration-500">
                            <div className="relative h-72 w-full">
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-black/40" />
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                                    <h2 className="text-white text-3xl font-bold tracking-wide mb-2 drop-shadow-md">
                                        {category.name}
                                    </h2>
                                    <span className="text-sm text-white/80 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-500">
                                        Xem chi tiết
                                    </span>
                                </div>
                            </div>
                        </a>
                    </Link>
                ))}
            </div>
            <AppPromoSection />
        </main>
    );
}
