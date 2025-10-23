import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";

// Dữ liệu giả cho các danh mục menu
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
        <main className="container mx-auto px-6 lg:px-10 py-12">
            <h1 className="text-4xl font-bold mb-8">Khám phá Thực đơn</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {menuCategories.map((category) => (
                    <Link href={category.href} key={category.name} legacyBehavior>
                        <a className="block group">
                            <Card className="overflow-hidden relative shadow-lg hover:shadow-xl transition-shadow">
                                <div className="relative h-64 w-full">
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                    {/* Lớp phủ màu tối */}
                                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors" />
                                </div>
                                {/* Tên danh mục */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <h2 className="text-white text-3xl font-bold tracking-wider">
                                        {category.name}
                                    </h2>
                                </div>

                            </Card>
                        </a>
                    </Link>
                ))}
            </div>
            <div className="app-promo-section w-full bg-[#FF4D00] flex justify-center items-center h-[45vh] relative mb-10">
                <div className="w-[60vw] flex items-center gap-8 h-full">
                    <div className="text-content text-white flex-1 pr-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                            Đặt bàn tại nhà hàng yêu thích chỉ trong vài phút.
                        </h2>
                    </div>

                    <div className="phone-images flex-1 relative h-full flex items-end justify-start">
                        <Image
                            src="/image/homepage/mobi-app.png"
                            alt="Ứng dụng di động"
                            width={600}
                            height={800}
                            className="h-[90%] max-h-[100%] w-auto object-contain"
                            priority
                        />
                    </div>
                </div>
            </div>
        </main>
    );
}