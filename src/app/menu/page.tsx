"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AppPromoSection from "@/components/aboutSection/page";

const menuData = [
    {
        category: "Món khai vị",
        description: "Những món nhẹ khơi dậy vị giác trước bữa ăn.",
        items: [
            {
                name: "Salad cá hồi hun khói",
                price: "190.000₫",
                image: "/image/menu/appetizer1.jpg",
                desc: "Cá hồi hun khói kết hợp rau xanh tươi và sốt chanh dây đặc biệt.",
            },
            {
                name: "Súp bí đỏ kem tươi",
                price: "160.000₫",
                image: "/image/menu/appetizer2.jpg",
                desc: "Súp bí đỏ sánh mịn, béo thơm, dùng nóng cùng bánh mì nướng.",
            },
            {
                name: "Bánh mì bơ tỏi",
                price: "120.000₫",
                image: "/image/menu/appetizer3.jpg",
                desc: "Giòn rụm, thơm bơ tỏi, món khai vị quốc dân.",
            },
            {
                name: "Gỏi tôm xoài xanh",
                price: "185.000₫",
                image: "/image/menu/appetizer4.jpg",
                desc: "Tôm tươi, xoài chua ngọt, nước mắm tỏi ớt cực bắt vị.",
            },
        ],
    },
    {
        category: "Món chính",
        description: "Tận hưởng tinh hoa ẩm thực qua từng món đặc sắc.",
        items: [
            {
                name: "Bò Wagyu nướng đá",
                price: "890.000₫",
                image: "/image/menu/main1.jpg",
                desc: "Miếng bò Wagyu thượng hạng nướng trên đá nóng, giữ trọn hương vị.",
            },
            {
                name: "Cá hồi sốt chanh leo",
                price: "520.000₫",
                image: "/image/menu/main2.jpg",
                desc: "Cá hồi Nauy áp chảo, dùng kèm sốt chanh leo tươi mát.",
            },
            {
                name: "Mỳ Ý sốt bò bằm",
                price: "280.000₫",
                image: "/image/menu/main3.jpg",
                desc: "Sốt bò bằm đậm đà cùng mì Ý al dente chuẩn vị Ý.",
            },
            {
                name: "Sườn cừu nướng rosemary",
                price: "790.000₫",
                image: "/image/menu/main4.jpg",
                desc: "Sườn cừu mềm mọng, ướp rosemary và tỏi, nướng than hoa.",
            },
        ],
    },
    {
        category: "Món tráng miệng",
        description: "Kết thúc bữa ăn với hương vị ngọt ngào tinh tế.",
        items: [
            {
                name: "Bánh mousse chocolate",
                price: "190.000₫",
                image: "/image/menu/dessert1.jpg",
                desc: "Lớp mousse chocolate mềm mịn, tan chảy trong miệng.",
            },
            {
                name: "Kem vani dâu tây",
                price: "150.000₫",
                image: "/image/menu/dessert2.jpg",
                desc: "Kem lạnh vị vani kết hợp dâu tươi tươi mát.",
            },
            {
                name: "Panna Cotta trái cây",
                price: "170.000₫",
                image: "/image/menu/dessert3.jpg",
                desc: "Panna Cotta Ý thanh nhẹ, phủ sốt trái cây mùa hè.",
            },
        ],
    },
];

export default function MenuPage() {
    const router = useRouter();
    const [selectedItem, setSelectedItem] = useState<any>(null);
    const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const scroll = (id: string, dir: "left" | "right") => {
        const el = scrollRefs.current[id];
        if (!el) return;
        const amount = dir === "left" ? -400 : 400;
        el.scrollBy({ left: amount, behavior: "smooth" });
    };

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
                {menuData.map((section, idx) => {
                    const refId = `scroll-${idx}`;
                    return (
                        <div key={idx} className="relative group">
                            {/* Title */}
                            <div className="mb-6">
                                <h2 className="text-3xl font-semibold text-[#ffb84d] mb-1">{section.category}</h2>
                                <p className="text-gray-600 dark:text-gray-400">{section.description}</p>
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
                                {section.items.map((item, i) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedItem(item)}
                                        className="min-w-[280px] sm:min-w-[320px] snap-start cursor-pointer group/item relative bg-white/95 dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md hover:shadow-[0_8px_40px_rgba(255,184,77,0.4)] transition-all duration-500 transform hover:-translate-y-2"
                                    >
                                        <div className="relative h-60 w-full">
                                            <Image
                                                src={item.image}
                                                alt={item.name}
                                                fill
                                                className="object-cover group-hover/item:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover/item:opacity-50 transition" />
                                        </div>
                                        <div className="p-5 text-center">
                                            <h3 className="text-lg font-semibold mb-1 group-hover/item:text-[#ffb84d] transition">
                                                {item.name}
                                            </h3>
                                            <p className="text-[#ffb84d] font-medium">{item.price}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </section>

            {/* Modal Chi Tiết */}
            {selectedItem && (
                <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
                    <DialogContent className="max-w-lg bg-white dark:bg-[#1a1a1a] rounded-2xl border border-gray-200 dark:border-gray-700">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-semibold text-[#ffb84d] mb-2">
                                {selectedItem.name}
                            </DialogTitle>
                        </DialogHeader>
                        <div className="relative w-full h-64 mb-4 rounded-xl overflow-hidden">
                            <Image src={selectedItem.image} alt={selectedItem.name} fill className="object-cover" />
                        </div>
                        <p className="text-gray-700 dark:text-gray-300 mb-4">{selectedItem.desc}</p>
                        <p className="text-[#ffb84d] text-lg font-semibold mb-6">
                            Giá: {selectedItem.price}
                        </p>
                        <Button
                            className="w-full bg-[#ffb84d] hover:bg-[#ffa726] text-white py-2 rounded-md text-sm font-medium tracking-wide"
                            onClick={() => router.push("/booking")}
                        >
                            Đặt bàn ngay
                        </Button>
                    </DialogContent>
                </Dialog>
            )}

            {/* Promo Section */}
            <AppPromoSection />
        </main>
    );
}
