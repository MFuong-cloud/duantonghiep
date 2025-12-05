import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function FooterForm() {
    return (
        <footer className="w-full bg-gradient-to-br from-orange-50 to-amber-50 dark:from-gray-900 dark:to-gray-950 border-t border-orange-200 dark:border-gray-800 rounded-t-2xl shadow-[0_-2px_15px_rgba(0,0,0,0.05)] dark:shadow-[0_-2px_15px_rgba(0,0,0,0.3)] transition-colors">
            <div className="max-w-6xl mx-auto px-5 py-8 lg:py-10">
                {/* Layout chính */}
                <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">

                    {/* === Logo & mô tả === */}
                    <div className="lg:w-[35%] flex flex-col gap-3">
                        <h2 className="text-orange-500 dark:text-orange-400 text-3xl font-bold tracking-tight">
                            Tablego<span className="text-gray-800 dark:text-gray-200">Restaurant</span>
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400 text-[15px] leading-relaxed">
                            Trải nghiệm ẩm thực đẳng cấp với không gian sang trọng và món ăn tươi ngon.
                            Đặt bàn dễ dàng, phục vụ tận tâm.
                        </p>

                        {/* Thông tin liên hệ */}
                        <div className="flex flex-col gap-2 mt-2 text-gray-700 dark:text-gray-300 text-sm">
                            <div className="flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                                <span>B2-R2-13, Royal City, Hà Nội</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                                <span>0909 123 456</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                                <span>contact@tablego.vn</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                                <span>10:00 - 22:00 (T2 - CN)</span>
                            </div>
                        </div>

                        {/* Social Media */}
                        <div className="flex gap-3 mt-3">
                            {[
                                { name: "Facebook", icon: "M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" },
                                { name: "Instagram", icon: "M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" },
                                { name: "Twitter", icon: "M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" },
                            ].map((social, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label={social.name}
                                    className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-sm hover:bg-orange-50 dark:hover:bg-orange-900/30 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-200 text-gray-600 dark:text-gray-400"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d={social.icon} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* === Các cột link === */}
                    <div className="lg:w-[60%] grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-8">
                        {[
                            {
                                title: "Dịch vụ",
                                links: [
                                    { name: "Đặt bàn", href: "/booking" },
                                    { name: "Thực đơn", href: "/menu" },
                                    { name: "Đặt món", href: "/order" },
                                    { name: "Lịch sử", href: "/history" },
                                ],
                            },
                            {
                                title: "Về chúng tôi",
                                links: [
                                    { name: "Giới thiệu", href: "/homepage" },
                                    { name: "Liên hệ", href: "#" },
                                    { name: "Tuyển dụng", href: "#" },
                                    { name: "Tin tức", href: "#" },
                                ],
                            },
                            {
                                title: "Hỗ trợ",
                                links: [
                                    { name: "Câu hỏi thường gặp", href: "#" },
                                    { name: "Chính sách", href: "#" },
                                    { name: "Điều khoản", href: "#" },
                                    { name: "Bảo mật", href: "#" },
                                ],
                            },
                        ].map((col, i) => (
                            <div key={i} className="flex flex-col gap-3">
                                <h3 className="text-[17px] font-semibold text-gray-900 dark:text-white">{col.title}</h3>
                                <nav className="flex flex-col gap-1.5">
                                    {col.links.map((link, j) => (
                                        <a
                                            key={j}
                                            href={link.href}
                                            className="text-gray-600 dark:text-gray-400 text-[15px] hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
                                        >
                                            {link.name}
                                        </a>
                                    ))}
                                </nav>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dòng cuối */}
                <div className="mt-8 pt-4 border-t border-orange-200 dark:border-gray-800 text-center text-sm text-gray-600 dark:text-gray-400">
                    © 2025 Tablego Restaurant. All rights reserved. Made with ❤️ in Hanoi
                </div>
            </div>
        </footer>
    );
}
