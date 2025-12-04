"use client";

import { useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, MapPin, Phone, Clock } from "lucide-react";

import BookingForm from "@/components/booking-form";
import AppPromoSection from "@/components/aboutSection/page";

export default function BookingPageContent() {
    const router = useRouter();

    // ============================
    // CỬA HÀNG MẶC ĐỊNH – KHÔNG CẦN BRANCH ID
    // ============================
    const defaultBranch = {
        id: 1,
        name: "Nhà Hàng Ngon Riverside",
        image: "/image/homepage/restaurant-preview.jpg",
        address: "123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh",
        phone: "0909 123 456",
        category: "Việt – Âu – Á",
        price: "$$ – $$$",
    };

    // Dữ liệu món ăn demo
    const dishes = useMemo(
        () => [
            { name: "Bò bít tết sốt tiêu đen", price: "250.000₫", img: "/image/homepage/dish1.jpg", category: "Món chính" },
            { name: "Cá hồi nướng mật ong", price: "320.000₫", img: "/image/homepage/dish2.jpg", category: "Món chính" },
            { name: "Tôm càng rang muối", price: "280.000₫", img: "/image/homepage/dish3.jpg", category: "Hải sản" },
            { name: "Lẩu Thái hải sản", price: "350.000₫", img: "/image/homepage/dish4.jpg", category: "Lẩu" },
        ],
        []
    );

    return (
        <main className="w-full min-h-screen bg-gray-50">
            {/* ============================ */}
            {/* HERO */}
            {/* ============================ */}
            <section className="relative w-full h-[350px] md:h-[450px] overflow-hidden">
                <Image
                    src={defaultBranch.image}
                    alt={defaultBranch.name}
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

                <div className="absolute bottom-10 left-6 md:left-16 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">{defaultBranch.name}</h1>

                    <div className="flex items-center gap-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <p className="text-lg font-medium">4.8 / 5 · 230 đánh giá</p>
                    </div>

                    <p className="text-sm md:text-base opacity-80">
                        Ẩm thực {defaultBranch.category} · Không gian sang trọng · Giá {defaultBranch.price} · {defaultBranch.address}
                    </p>
                </div>
            </section>

            {/* ============================ */}
            {/* MAIN CONTENT */}
            {/* ============================ */}
            <section className="container mx-auto px-6 lg:px-10 py-12 flex flex-col lg:flex-row gap-12">
                {/* LEFT CONTENT */}
                <div className="lg:basis-[60%] space-y-10">

                    {/* Giới thiệu */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Giới thiệu</h2>

                        <p className="text-gray-600 leading-relaxed">
                            {defaultBranch.name} mang đến trải nghiệm ẩm thực đẳng cấp, kết hợp giữa không gian tinh tế
                            và những món ăn độc đáo được chế biến từ nguyên liệu tươi sống. Hãy tận hưởng bữa tối hoàn hảo
                            cùng người thân hoặc đối tác tại không gian sang trọng của chúng tôi.
                        </p>

                        {/* Thông tin chi tiết */}
                        <div className="mt-6 space-y-3 text-gray-700">
                            <p className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-600" /> {defaultBranch.address}
                            </p>

                            <p className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-orange-600" /> {defaultBranch.phone}
                            </p>

                            <p className="flex items-center gap-2">
                                <Clock className="w-5 h-5 text-orange-600" /> 10:00 - 22:00 (T2 - CN)
                            </p>
                        </div>

                        <div className="mt-6">
                            <button
                                onClick={() => router.push("/menu")}
                                className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors"
                            >
                                Xem thực đơn
                            </button>
                        </div>

                        <a
                            href="https://maps.app.goo.gl/hsY4T618UH9mG6CU6"
                            target="_blank"
                            rel="nofollow noopener noreferrer"
                            className="block"
                        >
                            <div className="mt-8 w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6087449344595!2d105.81382607503205!3d21.003140080632976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acbf6bdc484b%3A0x8164ec071329e7f2!2sGoGi%20House%20Royal%20City!5e0!3m2!1svi!2s!4v1733304593000!5m2!1svi!2s"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0, pointerEvents: 'none' }}
                                    allowFullScreen
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                ></iframe>
                            </div>
                        </a>
                    </div>
                </div>

                {/* RIGHT CONTENT */}
                <div className="lg:basis-[40%] relative">
                    <div className="sticky top-24">
                        <BookingForm />
                    </div>
                </div>
            </section>

            {/* APP SECTION */}
            <AppPromoSection />
        </main>
    );
}
