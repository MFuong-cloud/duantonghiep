import Image from "next/image";

export default function AboutSectionPage() {
    return (
        <div>
            <div
                className="app-promo-section w-full bg-orange-500 flex justify-center items-center h-[45vh] relative mb-10">
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
        </div>
    );
}
