"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { BranchService } from "@/api/branches/branch.service";
import {Branch} from "@/model/Branch";

export default function BookingList() {
    const router = useRouter();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoading(true);
                const result = await BranchService.getListBranch();
                
                if (result.ok && result.payload) {
                    // Xử lý dữ liệu trả về - có thể là result.payload.data hoặc result.payload
                    const branchesData:Branch[] = Array.isArray(result.payload.data)
                        ? result.payload.data
                        : Array.isArray(result.payload)
                            ? result.payload
                            : [result.payload];
                    setBranches(branchesData);
                } else {
                    console.error("Lỗi khi lấy danh sách nhà hàng:", result.payload?.message);
                    setBranches([]);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                setBranches([]);
            } finally {
                setLoading(false);
            }
        };

        fetchBranches();
    }, []);

    return (
        <div className="w-full px-6 md:px-20 lg:px-40 xl:px-60 my-16 transition-all duration-300">
            {/* === PHẦN ĐẶT BÀN NGAY === */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-3xl md:text-4xl hover:text-blue-600 transition-colors duration-300 cursor-default">
                    Đặt bàn ngay
                </h3>

                <button
                    onClick={() => router.push("/restaurants")}
                    className="text-orange-500 font-semibold text-sm md:text-base 
                    hover:text-amber-600 hover:-translate-x-1 active:translate-x-0 
                    transition-all duration-300 cursor-pointer"
                >
                    Xem thêm →
                </button>
            </div>

            <Carousel opts={{ align: "start" }} className="w-full mb-20">
                <CarouselContent>
                    {loading ? (
                        <CarouselItem className="basis-full">
                            <div className="flex justify-center items-center py-20">
                                <p className="text-gray-500">Đang tải danh sách nhà hàng...</p>
                            </div>
                        </CarouselItem>
                    ) : branches.length === 0 ? (
                        <CarouselItem className="basis-full">
                            <div className="flex justify-center items-center py-20">
                                <p className="text-gray-500">Không có nhà hàng nào</p>
                            </div>
                        </CarouselItem>
                    ) : (
                        branches.map((branch) => (
                            <CarouselItem
                                key={branch.id}
                                className="basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
                            >
                                <div className="p-2 group">
                                    <Card
                                        onClick={() => router.push(`/booking/${branch.id}`)}
                                        className="rounded-xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2 bg-white/90 backdrop-blur-sm cursor-pointer"
                                    >
                                        <div className="relative h-44 md:h-48 overflow-hidden">
                                            <Image
                                                src={branch.image || "/image/homepage/restaurant.png"}
                                                alt={branch.name || "Nhà hàng"}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                        </div>

                                        <CardContent className="p-4 flex flex-col justify-between">
                                            <div>
                                                <h4 className="font-bold text-lg mb-1 line-clamp-1 transition-colors duration-300 group-hover:text-blue-600">
                                                    {branch.name || "Nhà hàng"}
                                                </h4>
                                                <div className="flex items-center gap-1 mb-1">
                                                    <span className="text-yellow-500 text-sm">★</span>
                                                    <span className="font-medium text-sm">{"5.0"}</span>
                                                    <span className="text-gray-500 text-sm">
                                                        {branch.category ? ` · ${branch.category}` : " · Món Hoa"} · {branch.price || "$$"}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-1 text-sm text-gray-500">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        width="16"
                                                        height="16"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        className="transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-500"
                                                    >
                                                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                                                    </svg>
                                                    <span>{branch.address || "Hà Nội"}</span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    router.push(`/booking/${branch.id}`);
                                                }}
                                                className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md text-sm font-medium
                                                transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md
                                                hover:scale-[1.05] active:scale-95"
                                            >
                                                Booking now
                                            </button>
                                        </CardContent>
                                    </Card>
                                </div>
                            </CarouselItem>
                        ))
                    )}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>

            {/* === PHẦN CÁC MÓN ĂN NỔI BẬT === */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-3xl md:text-4xl hover:text-red-500 transition-colors duration-300 cursor-default">
                    Món ăn nổi bật
                </h3>

                <button
                    onClick={() => router.push("/menu")}
                    className="text-orange-500 font-semibold text-sm md:text-base 
                    hover:text-amber-600 hover:-translate-x-1 active:translate-x-0 
                    transition-all duration-300 cursor-pointer"
                >
                    Xem thêm →
                </button>
            </div>

            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                    {Array.from({ length: 8 }).map((_, index) => (
                        <CarouselItem
                            key={index}
                            className="basis-full xs:basis-1/2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"

                        >
                            <div className="p-2 group">
                                <Card className="rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 transform group-hover:-translate-y-2">
                                    <div className="relative h-40 overflow-hidden">
                                        <Image
                                            src="/image/food/food.jpg"
                                            alt="Món ăn nổi bật"
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>

                                    <CardContent className="p-4 flex flex-col justify-between">
                                        <div>
                                            <h4 className="font-bold text-lg mb-2 group-hover:text-red-500 transition-colors duration-300">
                                                Bò lúc lắc kiểu Pháp
                                            </h4>
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-500 text-sm">250.000đ</span>
                                                <button
                                                    onClick={() => router.push("/menu")}
                                                    className="text-sm px-3 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all duration-300"
                                                >
                                                    Xem món
                                                </button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
            </Carousel>
        </div>
    );
}
