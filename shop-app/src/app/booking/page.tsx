// src/app/booking/page.tsx

import { BookingForm } from "@/components/booking-form";
import Image from "next/image"; // <-- BẮT BUỘC: Thêm import Image

export default function BookingPage() {
    return (
        // 1. Dùng Fragment để bọc nhiều phần tử
        <>
            {/* 2. Giữ nguyên <main> để căn giữa form */}
            <main className="container mx-auto px-6 lg:px-10 py-12 flex items-center justify-center min-h-[calc(100vh-8rem)]">
                <BookingForm />
            </main>

            {/* 3. Thêm phần quảng cáo app (đã bổ sung nút tải) */}
            <div className="app-promo-section w-full bg-[#FF4D00] flex justify-center items-center h-[45vh] relative mb-10">
                <div className="w-[60vw] flex items-center gap-8 h-full">
                    {/* --- PHẦN NỘI DUNG VĂN BẢN --- */}
                    <div className="text-content text-white flex-1 pr-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                            Đặt bàn tại nhà hàng yêu thích chỉ trong vài phút.
                        </h2>

                        <p className="text-lg opacity-90 mb-8">
                            Tải ứng dụng miễn phí để khám phá, đặt bàn và nhận ưu đãi độc quyền mọi lúc mọi nơi.
                        </p>

                        {/* Các nút tải ứng dụng */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                            {/* Nút App Store */}
                            <a
                                href="#"
                                className="flex items-center justify-center gap-3 px-5 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors"
                            >
                                <span className="text-2xl"></span>
                                <div>
                                    <p className="text-xs -mb-1">Tải về trên</p>
                                    <p className="text-xl font-semibold">App Store</p>
                                </div>
                            </a>

                            {/* Nút Google Play */}
                            <a
                                href="#"
                                className="flex items-center justify-center gap-3 px-5 py-3 bg-black text-white rounded-lg shadow-md hover:bg-gray-800 transition-colors"
                            >
                                {/* Bạn có thể thay bằng icon Google Play SVG */}
                                <span className="text-2xl">►</span>
                                <div>
                                    <p className="text-xs -mb-1">LẤY TRÊN</p>
                                    <p className="text-xl font-semibold">Google Play</p>
                                </div>
                            </a>
                        </div>
                    </div>

                    {/* --- PHẦN HÌNH ẢNH --- */}
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
        </>
    );
}