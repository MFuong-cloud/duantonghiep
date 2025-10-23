import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// Bạn sẽ lấy mảng này từ API, đây là dữ liệu giả
const allRestaurants = Array.from({ length: 12 }).map((_, i) => ({
    id: i,
    name: `Nhà Hàng Lippo Chiuchow ${i + 1}`,
    image: "/image/homepage/restaurant.png", // Thay bằng ảnh thật
    rating: (Math.random() * 1 + 4).toFixed(1), // 4.0 -> 5.0
    category: "Món Hoa",
    price: "$$",
    location: "Hà Nội",
}));

export default function RestaurantsPage() {
    return (
        <main className="container mx-auto px-6 lg:px-10 py-12">
            <h1 className="text-4xl font-bold mb-8">Tất cả nhà hàng</h1>

            {/* Lưới hiển thị các nhà hàng */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {allRestaurants.map((restaurant) => (
                    <Card key={restaurant.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
                        <div className="relative h-48 w-full">
                            <Image
                                src={restaurant.image}
                                alt={restaurant.name}
                                fill
                                className="object-cover"
                            />
                        </div>
                        <CardContent className="p-4">
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