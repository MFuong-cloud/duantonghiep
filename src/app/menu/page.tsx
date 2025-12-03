"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import AppPromoSection from "@/components/aboutSection/page";
import { DishService } from "@/api/menu/menu.service";
import { Dish } from "@/model/Dish";

interface MenuSection {
    category: string;
    categoryId: number;
    description: string;
    items: Dish[];
}

export default function MenuPage() {
    const router = useRouter();
    const [menuData, setMenuData] = useState<MenuSection[]>([]);
    const [loading, setLoading] = useState(true);
    const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

    useEffect(() => {
        fetchDishes();
    }, []);

    const fetchDishes = async () => {
        try {
            setLoading(true);
            const dishes = await DishService.getDishes();

            // Nhóm món ăn theo category
            const grouped: Record<number, MenuSection> = {};

            dishes.forEach((dish) => {
                const catId = dish.category_id;
                if (!grouped[catId]) {
                    grouped[catId] = {
                        category: dish.category?.name || `Danh mục ${catId}`,
                        categoryId: catId,
                        description: dish.category?.description || "",
                        items: [],
                    };
                }
                grouped[catId].items.push(dish);
            });

            setMenuData(Object.values(grouped));
        } catch (error) {
            console.error("Error fetching dishes:", error);
        } finally {
            setLoading(false);
        }
    };

    const scroll = (id: string, dir: "left" | "right") => {
        const el = scrollRefs.current[id];
        if (!el) return;
        const amount = dir === "left" ? -400 : 400;
        el.scrollBy({ left: amount, behavior: "smooth" });
    };

    const formatPrice = (price?: number) => {
        if (!price) return "Liên hệ";
        return price.toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
        });
    };

    const handleDishClick = (dishId: number) => {
        router.push(`/menu/${dishId}`);
    };

    if (loading) {
        return (
            <main className="bg-[#fffdf7] dark:bg-[#121212] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffb84d] mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải thực đơn...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#fffdf7] dark:bg-[#121212] text-[#1a1a1a] dark:text-[#e5e5e5] min-h-screen">
            {/* Banner */}
            <div className="relative h-[300px] w-full overflow-hidden">
                <Image
                    src="/image/menu/banner-menu.jpg"
                    alt="Menu Banner"
                    fill
                    className="object-cover brightness-75"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-md">
                        Thực Đơn Của Chúng Tôi
                    </h1>
                    <p className="text-lg opacity-90">Khám phá ẩm thực tinh tế & đậm chất riêng 🍷</p>
                </div>
            </div>

            {/* Menu Sections */}
            <section className="container mx-auto px-6 lg:px-10 py-16 space-y-20">
                {menuData.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-600 dark:text-gray-400 text-lg">
                            Chưa có món ăn nào trong thực đơn
                        </p>
                    </div>
                ) : (
                    menuData.map((section, idx) => {
                        const refId = `scroll-${idx}`;
                        return (
                            <div key={idx} className="relative group">
                                {/* Title */}
                                <div className="mb-6">
                                    <h2 className="text-3xl font-semibold text-[#ffb84d] mb-1">{section.category}</h2>
                                    {section.description && (
                                        <p className="text-gray-600 dark:text-gray-400">{section.description}</p>
                                    )}
                                </div>

                                {/* Arrow Buttons */}
                                <button
                                    onClick={() => scroll(refId, "left")}
                                    className="absolute -left-6 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-[#fff6e6] dark:bg-[#1a1a1a]/70 text-[#ffb84d] rounded-full shadow-md hover:scale-110 hover:bg-[#ffb84d] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                <button
                                    onClick={() => scroll(refId, "right")}
                                    className="absolute -right-6 top-1/2 -translate-y-1/2 z-10 p-2.5 bg-[#fff6e6] dark:bg-[#1a1a1a]/70 text-[#ffb84d] rounded-full shadow-md hover:scale-110 hover:bg-[#ffb84d] hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>

                                {/* Item List */}
                                <div
                                    ref={(el) => {
                                        scrollRefs.current[refId] = el;
                                    }}
                                    id={refId}
                                    className="flex gap-6 overflow-x-auto scroll-smooth scrollbar-hide pb-4 px-1 snap-x snap-mandatory cursor-grab active:cursor-grabbing"
                                >
                                    {section.items.map((item) => (
                                        <div
                                            key={item.id}
                                            onClick={() => handleDishClick(item.id)}
                                            className="min-w-[280px] sm:min-w-[320px] snap-start cursor-pointer group/item relative bg-white/95 dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md hover:shadow-[0_8px_40px_rgba(255,184,77,0.4)] transition-all duration-500 transform hover:-translate-y-2"
                                        >
                                            <div className="relative h-60 w-full">
                                                <Image
                                                    src={item.image_url || "/image/menu/default.jpg"}
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover group-hover/item:scale-110 transition-transform duration-700"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover/item:opacity-50 transition" />
                                            </div>
                                            <div className="p-5">
                                                <h3 className="text-lg font-semibold mb-3 text-center group-hover/item:text-[#ffb84d] transition">
                                                    {item.name}
                                                </h3>
                                                <div className="flex items-center justify-between gap-2">
                                                    <p className="text-[#ffb84d] font-medium text-base">
                                                        {formatPrice(item.price)}
                                                    </p>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${item.status
                                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                            }`}
                                                    >
                                                        {item.status ? "Còn hàng" : "Hết hàng"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })
                )}
            </section>

            {/* Promo Section */}
            <AppPromoSection />
        </main>
    );
}
