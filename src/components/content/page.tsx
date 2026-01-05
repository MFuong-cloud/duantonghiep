import Image from "next/image";

export default function MainContentPage() {
    return (
        <section className="py-16 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
                    {/* Featured Content - Left Column - 60% */}
                    <div className="lg:col-span-3 space-y-6">
                        <div className="relative overflow-hidden rounded-2xl shadow-xl group">
                            <Image
                                src="/image/homepage/banner2.png"
                                alt="TABLEGO - Lẩu Nướng Cao Cấp"
                                height={600}
                                width={800}
                                priority
                                className="w-full h-[650px] object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                                <span className="inline-block px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full mb-3">
                                    Đặc Sản Lẩu Nướng
                                </span>
                                <h2 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight">
                                    TABLEGO - Trải Nghiệm Lẩu Nướng Đẳng Cấp
                                </h2>
                                <p className="text-sm lg:text-base text-gray-200 line-clamp-2">
                                    Thưởng thức hương vị lẩu nướng tươi ngon với nguyên liệu cao cấp, không gian sang trọng và dịch vụ chuyên nghiệp
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Information Sidebar - Right Column - 40% */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Main Heading */}
                        <div className="space-y-4">
                            <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white leading-tight">
                                Khám phá ẩm thực lẩu nướng đỉnh cao tại TABLEGO
                            </h3>
                            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                                Trải nghiệm không gian lẩu nướng hiện đại với thực đơn đa dạng từ hải sản tươi sống,
                                thịt bò Úc cao cấp đến rau củ hữu cơ. TABLEGO cam kết mang đến bữa tiệc trọn vẹn
                                cho gia đình, bạn bè hay các buổi họp mặt quan trọng. Đặt bàn ngay hôm nay!
                            </p>
                        </div>

                        {/* Quick Links */}
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Danh mục</h4>
                            <ul className="space-y-2.5">
                                {[
                                    "Menu Lẩu Nướng",
                                    "Combo Ưu Đãi",
                                    "Đặt Bàn Trực Tuyến",
                                    "Sự Kiện & Tiệc",
                                    "Chương Trình Khuyến Mãi"
                                ].map((item, index) => (
                                    <li key={index}>
                                        <a
                                            href="#"
                                            className="text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-500 transition-colors duration-200 flex items-center group"
                                        >
                                            <span className="w-1.5 h-1.5 bg-red-600 rounded-full mr-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            {item}
                                        </a>
                                    </li>
                                ))}
                                <li>
                                    <a href="#" className="text-red-600 dark:text-red-500 font-medium hover:text-red-700 dark:hover:text-red-400 transition-colors">
                                        Xem thêm →
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Social Links */}
                        <div className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wide">Kết nối với TABLEGO</h4>
                            <div className="flex gap-4">
                                {[
                                    { name: "Instagram", path: "M12 2.163c3.204 0 3.584.012 4.847.07 3.252.148 4.771 1.691 4.919 4.919.058 1.263.069 1.643.069 4.847v.004c0 3.204-.012 3.584-.069 4.847-.149 3.228-1.668 4.771-4.919 4.919-1.263.058-1.643.069-4.847.069h-.004c-3.204 0-3.584-.012-4.847-.069-3.252-.148-4.771-1.691-4.919-4.919-.057-1.263-.069-1.643-.069-4.847v-.004c0-3.204.012-3.584.069-4.847.149-3.228 1.668-4.771 4.919-4.919 1.263-.058 1.643-.069 4.847-.069h.004zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.28-.073 1.688-.073 4.948v.004c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.688.072 4.948.072h.004c3.259 0 3.668-.014 4.947-.072 4.359-.2 6.78-2.618 6.98-6.98.059-1.28.073-1.688.073-4.948v-.004c0-3.259-.014-3.667-.072-4.947-.2-4.359-2.618-6.78-6.98-6.98-1.28-.059-1.689-.073-4.948-.073h-.004zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.283 0-4.162-1.879-4.162-4.162s1.879-4.162 4.162-4.162 4.162 1.879 4.162 4.162-1.879 4.162-4.162 4.162zm6.406-11.845c-.748 0-1.441-.568-1.441-1.283s.693-1.283 1.441-1.283 1.441.568 1.441 1.283-.693 1.283-1.441 1.283z" },
                                    { name: "Twitter/X", path: "M18.244 2.25h3.308l-7.247 8.47 7.247 8.47-3.308 1.02H9.27l-7.247-8.47L9.27 3.27H18.244z" },
                                    { name: "Facebook", path: "M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.064V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.972.923-1.972 1.877v2.25h3.356l-.53 3.47h-2.826v8.385C19.612 23.027 24 18.062 24 12.073z" }
                                ].map((social) => (
                                    <a
                                        key={social.name}
                                        href="#"
                                        aria-label={social.name}
                                        className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-all duration-300"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
                                            <path d={social.path} />
                                        </svg>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
