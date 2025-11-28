export default function FooterForm() {
    return (
        <footer className="w-full bg-[#fffdf8] border-t border-gray-200 rounded-t-2xl shadow-[0_-2px_15px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto px-5 py-8 lg:py-10">
                {/* Layout chính */}
                <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">
                    
                    {/* === Logo & mô tả === */}
                    <div className="lg:w-[30%] flex flex-col gap-3">
                        <h2 className="text-orange-500 text-3xl font-bold tracking-tight">
                            Table<span className="text-gray-800">Go</span>
                        </h2>
                        <p className="text-gray-600 text-[15px] leading-relaxed">
                            Hãy để chúng tôi đem đến dịch vụ và món ngon cho bạn.
                        </p>
                    </div>

                    {/* === Các cột link === */}
                    <div className="lg:w-[65%] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                        {[
                            {
                                title: "Thông tin",
                                links: ["Nhà hàng", "Đánh giá", "Nghĩa vụ", "Về chúng tôi"],
                            },
                            {
                                title: "Dịch vụ",
                                links: ["Đặt bàn", "Đặt món", "Đặt bàn theo nhu cầu, sự kiện"],
                            },
                            {
                                title: "Hỗ trợ",
                                links: ["Liên hệ", "Những câu hỏi thường gặp"],
                            },
                            {
                                title: "Kết nối",
                                links: ["Facebook", "Instagram", "Threads"],
                            },
                        ].map((col, i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <h3 className="text-[17px] font-semibold text-gray-900">{col.title}</h3>
                                <nav className="flex flex-col gap-1">
                                    {col.links.map((link, j) => (
                                        <a
                                            key={j}
                                            href="#"
                                            className="text-gray-600 text-[15px] hover:text-orange-500 transition-colors"
                                        >
                                            {link}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dòng cuối */}
                <div className="mt-8 pt-4 border-t border-gray-200 text-center text-sm text-gray-500">
                    © 2025 TableGo. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
