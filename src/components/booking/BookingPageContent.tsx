"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { Star, MapPin, Phone, Clock } from "lucide-react";

import BookingForm from "@/components/booking-form";
import AppPromoSection from "@/components/aboutSection/page";

export default function BookingPageContent() {
    const router = useRouter();

    return (
        <main className="w-full min-h-screen bg-gray-50 dark:bg-[#121212] transition-colors">
            <section className="relative w-full h-[550px] md:h-[550px] overflow-hidden">
                <Image
                    src="/image/banner.png"
                    alt="Nhà Hàng Ngon Tablego"
                    fill
                    className="object-cover"
                    priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20" />

                <div className="absolute bottom-10 left-6 md:left-16 text-white">
                    <h1 className="text-4xl md:text-5xl font-bold mb-3">Nhà Hàng Ngon Tablego</h1>

                    <div className="flex items-center gap-3 mb-2">
                        <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                        <p className="text-lg font-medium">4.8 / 5 · 230 đánh giá</p>
                    </div>

                    <p className="text-sm md:text-base opacity-80">
                        Lẩu - Nướng - Hải sản - Tráng miệng · Không gian sạch sẽ - Giá cả phải chăng - Khu đô thị Royal City, Hà Nội
                    </p>
                </div>
            </section>

            <section className="container mx-auto px-6 lg:px-10 py-12 flex flex-col lg:flex-row gap-12">
                <div className="lg:basis-[60%] space-y-10">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Giới thiệu</h2>

                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                            Tablego mang đến trải nghiệm ẩm thực đẳng cấp, kết hợp giữa không gian tinh tế
                            và những món ăn độc đáo được chế biến từ nguyên liệu tươi sống. Hãy tận hưởng bữa tối hoàn hảo
                            cùng người thân hoặc đối tác tại không gian sang trọng của chúng tôi.
                        </p>

                        <div className="mt-6 space-y-3 text-gray-700 dark:text-gray-300">
                            <p className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-orange-600" /> Khu đô thị Royal City, Hà Nội
                            </p>

                            <p className="flex items-center gap-2">
                                <Phone className="w-5 h-5 text-orange-600" /> 0909 123 456
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
                            <div className="mt-8 w-full h-[400px] rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
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

                <div className="lg:basis-[40%] relative">
                    <div className="sticky top-24">
                        <BookingForm />
                    </div>
                </div>
            </section>

            <AppPromoSection />
        </main>
    );
}
