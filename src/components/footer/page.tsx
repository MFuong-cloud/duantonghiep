export default function FooterForm() {
    return (
        <footer className="w-full bg-[#fffdf8] border-t border-gray-200 rounded-t-2xl shadow-[0_-2px_15px_rgba(0,0,0,0.05)]">
            <div className="max-w-6xl mx-auto px-5 py-8 lg:py-10">
                {/* Layout chính */}
                <div className="flex flex-col lg:flex-row justify-between gap-8 lg:gap-10">
                    
                    {/* === Logo & mô tả === */}
                    <div className="lg:w-[30%] flex flex-col gap-3">
                        <h2 className="text-orange-500 text-3xl font-bold tracking-tight">
                            Booking<span className="text-gray-800">Now</span>
                        </h2>
                        <p className="text-gray-600 text-[15px] leading-relaxed">
                            Powering the world’s best restaurants with modern tech and seamless booking experiences.
                        </p>
                        <div className="flex gap-3 mt-2 text-gray-500">
                            {["Instagram", "Twitter", "Facebook"].map((label, i) => (
                                <a
                                    key={i}
                                    href="#"
                                    aria-label={label}
                                    className="p-2 bg-white rounded-full shadow-sm hover:bg-orange-50 hover:text-orange-500 transition-all duration-200"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="20"
                                        height="20"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <circle cx="12" cy="12" r="10" />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* === Các cột link === */}
                    <div className="lg:w-[65%] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-8">
                        {[
                            {
                                title: "About",
                                links: ["Nearby", "Top Rated", "New on Resy", "Guides"],
                            },
                            {
                                title: "Careers",
                                links: ["Stories", "Offers", "Access", "Security"],
                            },
                            {
                                title: "Support",
                                links: ["Contact Us", "Help Center", "FAQ"],
                            },
                            {
                                title: "Connect",
                                links: ["Blog", "Partners", "Dashboard"],
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
                    © 2025 BookingNow. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
