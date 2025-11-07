"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const allRestaurants = Array.from({ length: 12 }).map((_, i) => ({
    id: i + 1,
    name: `Nhà Hàng Lippo Chiuchow ${i + 1}`,
    image: "/image/homepage/restaurant.png",
    rating: (Math.random() * 1 + 4).toFixed(1),
    category: "Món Hoa",
    price: "$$",
    location: "Hà Nội",
}));

export default function RestaurantsPage() {
    const router = useRouter();

    return (
        <main className="container mx-auto px-6 lg:px-10 py-12">
            <h1 className="text-4xl font-bold mb-8">Tất cả nhà hàng</h1>

            {/* Lưới hiển thị các nhà hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allRestaurants.map((restaurant) => (
                    <Card
                        key={restaurant.id}
                        className="relative overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 group cursor-pointer"
                        onClick={() => router.push(`/booking/${restaurant.id}`)}
                    >
                        <div className="relative h-48 w-full overflow-hidden">
                            <Image
                                src={restaurant.image}
                                alt={restaurant.name}
                                fill
                                className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                            />
                            {/* Overlay khi hover */}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            {/* Nút Booking */}
                            <button
                                onClick={(e) => {
                                    e.stopPropagation(); // Không để click lan lên card
                                    router.push(`/booking/${restaurant.id}`);
                                }}
                                className="absolute inset-x-0 bottom-4 mx-auto w-[70%] bg-white text-[#FF4D00] font-semibold py-2 rounded-xl 
                                           opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0
                                           transition-all duration-500 shadow-md hover:bg-[#FF4D00] hover:text-white"
                            >
                                Booking Now
                            </button>
                        </div>

                        <CardContent className="p-4 bg-white">
                            <h3 className="font-bold text-lg mb-1">{restaurant.name}</h3>
                            <div className="flex items-center gap-1 mb-2">
                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                <span className="font-medium">{restaurant.rating}</span>
                                <span className="text-gray-500 text-sm">
                                    · {restaurant.category} · {restaurant.price}
                                </span>
                            </div>
                            <p className="text-sm text-gray-500">{restaurant.location}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Phần app promo */}
            <div className="app-promo-section w-full bg-[#FF4D00] flex justify-center items-center h-[45vh] relative mt-16 mb-10 rounded-2xl shadow-xl">
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
