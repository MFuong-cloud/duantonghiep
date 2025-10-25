import Image from "next/image";

export default function MainContentPage() {
    return (
        <div className="sayhello-page flex pb-12 border-b border-gray-200 mt-10">
            <div className="welcome-page w-[65%] pr-8">
                <div className="w-[85%] grid overflow-hidden rounded-lg ml-auto">
                    <Image
                        src="/image/homepage/bg-homepage.jpg"
                        alt="Hình ảnh chính"
                        height={500}
                        width={5000}
                        className="w-full h-auto col-start-1 row-start-1"
                    />
                    <div className="col-start-1 row-start-1 self-end p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white rounded-b-lg">
                        <span className="text-red-500 font-bold text-sm">Danh Sách Nổi Bật</span>
                        <h2 className="text-2xl md:text-3xl font-bold mt-1 mb-2">
                            Khám Phá Những Nhà Hàng Đáng Thử Nhất Tại Hà Nội: Phở Thìn, Bún Chả Hương Liên, và Nhiều Hơn Nữa
                        </h2>
                        <p className="text-sm md:text-base opacity-90">
                            Hà Nội từ lâu đã nổi tiếng là thiên đường ẩm thực với hàng nghìn món ăn đặc sắc...
                        </p>
                    </div>
                </div>
            </div>

            <div className="newsfeed-page w-[25%] pl-8">
                <h3 className="font-semibold mb-2 text-4xl">Khám phá những nhà hàng tuyệt vời tại Hà Nội.</h3>
                <p className="text-xl mb-4">
                    Trở thành người đầu tiên cập nhật với các bài viết chuyên sâu, khám phá các địa điểm lâu đời và thông tin quan trọng về những nhà hàng mới nhất. Bạn đang cần tổ chức một bữa tiệc, một ngày sinh nhật hay một buổi hẹn hò lãng mạng thì đặt ngay nào!
                </p>

                <ul className="space-y-2 text-sm">
                    <li><a href="#" className="hover:underline">Danh Sách Nổi Bật</a></li>
                    <li><a href="#" className="hover:underline">Sự Kiện & Trải Nghiệm</a></li>
                    <li><a href="#" className="hover:underline">Mẹo Đặt Bàn</a></li>
                    <li><a href="#" className="hover:underline">Ẩm Thực Toàn Cầu</a></li>
                    <li><a href="#" className="hover:underline">Ưu Đãi Thẻ Ngân Hàng</a></li>
                    <li><a href="#" className="hover:underline">Xem thêm</a></li>
                </ul>

                <div className="mt-8 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium mb-3">Về Chúng Tôi</h4>
                    <div className="flex space-x-4 text-gray-500">
                        <a href="#" aria-label="Instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2.163c3.204 0 3.584.012 4.847.07 3.252.148 4.771 1.691 4.919 4.919.058 1.263.069 1.643.069 4.847v.004c0 3.204-.012 3.584-.069 4.847-.149 3.228-1.668 4.771-4.919 4.919-1.263.058-1.643.069-4.847.069h-.004c-3.204 0-3.584-.012-4.847-.069-3.252-.148-4.771-1.691-4.919-4.919-.057-1.263-.069-1.643-.069-4.847v-.004c0-3.204.012-3.584.069-4.847.149-3.228 1.668-4.771 4.919-4.919 1.263-.058 1.643-.069 4.847-.069h.004zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.28-.073 1.688-.073 4.948v.004c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.28.058 1.688.072 4.948.072h.004c3.259 0 3.668-.014 4.947-.072 4.359-.2 6.78-2.618 6.98-6.98.059-1.28.073-1.688.073-4.948v-.004c0-3.259-.014-3.667-.072-4.947-.2-4.359-2.618-6.78-6.98-6.98-1.28-.059-1.689-.073-4.948-.073h-.004zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.162 6.162 6.162 6.162-2.759 6.162-6.162-2.759-6.162-6.162-6.162zm0 10.162c-2.283 0-4.162-1.879-4.162-4.162s1.879-4.162 4.162-4.162 4.162 1.879 4.162 4.162-1.879 4.162-4.162 4.162zm6.406-11.845c-.748 0-1.441-.568-1.441-1.283s.693-1.283 1.441-1.283 1.441.568 1.441 1.283-.693 1.283-1.441 1.283z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Twitter/X">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18.244 2.25h3.308l-7.247 8.47 7.247 8.47-3.308 1.02H9.27l-7.247-8.47L9.27 3.27H18.244z" />
                            </svg>
                        </a>
                        <a href="#" aria-label="Facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.064V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.972.923-1.972 1.877v2.25h3.356l-.53 3.47h-2.826v8.385C19.612 23.027 24 18.062 24 12.073z" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
