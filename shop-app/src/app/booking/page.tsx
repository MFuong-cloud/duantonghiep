"use client";

import { BookingForm } from "@/components/booking-form";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, MapPin, Phone, Clock } from "lucide-react";
import AppPromoSection from "@/components/aboutSection/page";

export default function BookingPage() {
    const router = useRouter();

    const dishes = [
        { name: "Bò bít tết sốt tiêu đen", price: "250.000₫", img: "/image/homepage/dish1.jpg", category: "Món chính" },
        { name: "Cá hồi nướng mật ong", price: "320.000₫", img: "/image/homepage/dish2.jpg", category: "Món chính" },
        { name: "Tôm càng rang muối", price: "280.000₫", img: "/image/homepage/dish3.jpg", category: "Hải sản" },
        { name: "Lẩu Thái hải sản", price: "350.000₫", img: "/image/homepage/dish4.jpg", category: "Lẩu" },
    ];

    return (
        <main className="w-full min-h-screen bg-gray-50">
            {/* HERO */}
            <section className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
                <Image
                    src="/image/homepage/restaurant-preview.jpg"
                    alt="TableGo Restaurant"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

                <div className="absolute bottom-10 left-6 md:left-16 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">TableGo Restaurant</h1>
                    <div className="flex items-center gap-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <p className="text-lg font-medium">4.8 / 5 · 230 đánh giá</p>
                    </div>
                    <p className="text-sm md:text-base opacity-80">
                        Ẩm thực Âu - Á tinh tế · Không gian sang trọng · Giá $$ · Hà Nội
                    </p>
                </div>
            </section>

            {/* MAIN CONTENT */}
            <section className="container mx-auto px-6 lg:px-10 py-12 flex flex-col lg:flex-row gap-12">
                {/* LEFT CONTENT */}
                <div className="lg:basis-[60%] space-y-10">
                    {/* Giới thiệu */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Giới thiệu</h2>
                        <p className="text-gray-600 leading-relaxed">
                            TableGo Restaurant mang đến trải nghiệm ẩm thực đẳng cấp, kết hợp giữa
                            không gian tinh tế và những món ăn độc đáo được chế biến từ nguyên liệu tươi sống.
                            Hãy tận hưởng bữa tối hoàn hảo cùng người thân hoặc đối tác tại không gian sang trọng
                            của chúng tôi.
                        </p>

                        <div className="mt-6 space-y-3 text-gray-700">
                            <p className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-600" /> 123 Nguyễn Huệ, Quận 1, TP. HCM
                            </p>
                            <p className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-orange-600" /> 0909 999 999
                            </p>
                            <p className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-600" /> 10:00 - 22:00 (T2 - CN)
                            </p>
                        </div>

                        {/* Nút hành động */}
                        <div className="mt-6 flex gap-4">
                            <button
                                onClick={() => router.push("/menu")}
                                className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Xem thực đơn
                            </button>
                            <button
                                onClick={() => router.push("#reviews")}
                                className="px-6 py-3 border border-orange-600 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors"
                            >
                                Xem đánh giá
                            </button>
                        </div>

                        {/* Bản đồ Google ngay dưới */}
                        <div className="mt-8 w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.482142241813!2d106.70042387451757!3d10.77337408937461!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f47125f78f7%3A0x5dc49f37a6a3a64!2zMTIzIE5ndXnhu4VuIEh14buHLCBRdeG6rW4gMSwgSOG7kyBDaMOtbmgsIFRWLiBI4buTIENow60gTWluaCAtIFZpZXRuYW0!5e0!3m2!1svi!2s!4v1694437362355!5m2!1svi!2s"
                                width="100%"
                                height="100%"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>

                    {/* Gợi ý món ăn */}
                    <div>
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-2xl font-bold text-gray-800">Gợi ý món ăn</h2>
                            <button
                                onClick={() => router.push("/menu")}
                                className="text-orange-500 font-semibold text-sm hover:text-orange-600 transition-colors"
                            >
                                Xem thêm →
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            {dishes.map((dish, i) => (
                                <div
                                    key={i}
                                    className="group rounded-xl overflow-hidden border bg-white hover:shadow-xl transition-all duration-300 cursor-pointer"
                                >
                                    <div className="relative w-full h-36">
                                        <Image
                                            src={dish.img}
                                            alt={dish.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <h4 className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors line-clamp-1">
                                            {dish.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">{dish.category}</p>
                                        <p className="text-orange-600 font-semibold mt-1">
                                            {dish.price}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="lg:basis-[40%] relative">
                    <div className="sticky top-24">
                        <BookingForm />
                    </div>
                </div>
            </section>

            {/* APP PROMO SECTION */}
            <AppPromoSection />
        </main>
    );
}
