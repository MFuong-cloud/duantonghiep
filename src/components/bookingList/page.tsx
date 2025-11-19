"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
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
import { DishService } from "@/api/menu/menu.service";
import { Branch } from "@/model/Branch";
import { Dish } from "@/model/Dish";

// =====================
// Dish Description Component
// =====================
function DishDescription({ dish }: { dish: Dish }) {
    const descRef = useRef<HTMLDivElement>(null);
    const [expanded, setExpanded] = useState(false);

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation(); // Ngăn lan click Card
        setExpanded(true);

        // Scroll nội dung mô tả lên đầu
        if (descRef.current) {
            descRef.current.scrollTop = 0;
        }
    };

    return (
        <div className="flex flex-col mt-1">
            <div
                ref={descRef}
                className={`text-gray-700 text-sm transition-all duration-300 overflow-auto
                    ${expanded ? "max-h-[200px]" : "max-h-14"}
                `}
            >
                {dish.description || "Không có mô tả"}
            </div>
            {!expanded && dish.description && dish.description.length > 100 && (
                <button
                    onClick={handleExpand}
                    className="mt-1 text-blue-500 text-sm font-semibold hover:underline self-start"
                >
                    ... Xem thêm
                </button>
            )}
        </div>
    );
}

// =====================
// Main Component
// =====================
export default function BookingList() {
    const router = useRouter();
    const [branches, setBranches] = useState<Branch[]>([]);
    const [loadingBranches, setLoadingBranches] = useState(true);
    const [dishes, setDishes] = useState<Dish[]>([]);
    const [loadingDishes, setLoadingDishes] = useState(true);

    const formatVND = (value?: number) => {
        if (!value) return "Liên hệ";
        return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
    };

    // Fetch branches
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                setLoadingBranches(true);
                const result = await BranchService.getListBranch();
                const branchesData: Branch[] =
                    Array.isArray(result?.payload?.data)
                        ? result.payload.data
                        : Array.isArray(result?.payload)
                            ? result.payload
                            : [];
                setBranches(branchesData);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách nhà hàng:", error);
                setBranches([]);
            } finally {
                setLoadingBranches(false);
            }
        };
        fetchBranches();
    }, []);

    // Fetch dishes
    useEffect(() => {
        const fetchDishes = async () => {
            try {
                setLoadingDishes(true);
                const resp = await DishService.getDishes({});
                setDishes(Array.isArray(resp) ? resp : []);
            } catch (err) {
                console.error("Lỗi khi lấy món ăn:", err);
                setDishes([]);
            } finally {
                setLoadingDishes(false);
            }
        };
        fetchDishes();
    }, []);

    return (
        <div className="w-full px-6 md:px-20 lg:px-40 xl:px-60 my-16 transition-all duration-300">

            {/* =============================== */}
            {/* ĐẶT BÀN NGAY */}
            {/* =============================== */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-3xl md:text-4xl text-gray-900 hover:text-blue-600 transition-colors">
                    Đặt bàn ngay
                </h3>
                <button
                    onClick={() => router.push("/restaurants")}
                    className="text-orange-500 font-semibold text-sm hover:text-amber-600 transition-all"
                >
                    Xem thêm →
                </button>
            </div>

            <Carousel opts={{ align: "start" }} className="w-full mb-20">
                <CarouselContent>
                    {loadingBranches ? (
                        <CarouselItem className="basis-full">
                            <div className="flex justify-center py-20 text-gray-500">
                                Đang tải danh sách nhà hàng...
                            </div>
                        </CarouselItem>
                    ) : branches.length === 0 ? (
                        <CarouselItem className="basis-full">
                            <div className="flex justify-center py-20 text-gray-500">
                                Không có nhà hàng nào
                            </div>
                        </CarouselItem>
                    ) : (
                        branches.map(branch => (
                            <CarouselItem key={branch.id} className="basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5">
                                <div className="p-2 group">
                                    <Card
                                        onClick={() => router.push(`/booking?branchId=${branch.id}`)}
                                        className="rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                                    >
                                        <div className="relative h-48">
                                            <Image
                                                src={branch.image || "/image/homepage/restaurant.png"}
                                                alt={branch.name}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        </div>
                                        <CardContent className="p-4">
                                            <h4 className="font-bold text-lg mb-1 line-clamp-1 text-gray-900">
                                                {branch.name}
                                            </h4>
                                            <div className="flex items-center gap-1 text-sm text-gray-700 mb-1">
                                                <span className="text-yellow-500">★</span> 5.0
                                            </div>
                                            <div className="text-sm text-gray-600 line-clamp-1">
                                                {branch.address || "Hà Nội"}
                                            </div>
                                           <button
                                                onClick={(e) => {
                                                    e.stopPropagation(); 
                                                    router.push(`/booking?branchId=${branch.id}`);
                                                }}
                                                className="mt-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-md text-sm font-medium
                                                transition-all duration-300 hover:bg-blue-500 hover:text-white hover:shadow-md
                                                hover:scale-[1.05] active:scale-95"
                                            >
                                                Đặt bàn
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

            {/* =============================== */}
            {/* MÓN ĂN NỔI BẬT */}
            {/* =============================== */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-3xl md:text-4xl text-gray-900 hover:text-red-500 transition-colors">
                    Món ăn nổi bật
                </h3>
                <button
                    onClick={() => router.push("/menu")}
                    className="text-orange-500 font-semibold text-sm hover:text-amber-600 transition-all"
                >
                    Xem thêm →
                </button>
            </div>

            <Carousel opts={{ align: "start" }} className="w-full">
                <CarouselContent>
                    {loadingDishes ? (
                        <CarouselItem className="basis-full">
                            <div className="flex justify-center py-20 text-gray-500">Đang tải các món ăn...</div>
                        </CarouselItem>
                    ) : dishes.length === 0 ? (
                        <CarouselItem className="basis-full">
                            <div className="flex justify-center py-20 text-gray-500">Không có món ăn nào</div>
                        </CarouselItem>
                    ) : (
                        dishes.map(dish => (
                            <CarouselItem key={dish.id} className="basis-full sm:basis-1/2 md:basis-1/2 lg:basis-1/3 xl:basis-1/3">
                                <div className="p-2 group">
                                    <Card
                                        onClick={() => router.push(`/menu/${dish.id}`)}
                                        className={`rounded-xl shadow-md overflow-hidden transition cursor-pointer h-[520px] flex flex-col
                      ${dish.is_active ? "hover:shadow-2xl hover:scale-105" : "opacity-60"}`}
                                    >
                                        <div className="relative h-72">
                                            <Image
                                                src={dish.image_url || "/image/food/food.jpg"}
                                                alt={dish.name}
                                                fill
                                                className="object-cover transition-transform duration-500"
                                            />
                                        </div>

                                        <CardContent className="p-4 flex flex-col flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="font-bold text-lg line-clamp-1 text-gray-900">
                                                    {dish.name}
                                                </h4>
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${dish.is_active
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-gray-200 text-gray-600"}`}
                                                >
                                                    {dish.is_active ? "Còn hàng" : "Hết hàng"}
                                                </span>
                                            </div>

                                            <p className="font-bold text-orange-600 text-lg mb-1">{formatVND(dish.price)}</p>

                                            <p className="text-sm mb-2">
                                                <span className="font-bold text-gray-900">Danh mục:</span>{" "}
                                                <span className="font-medium text-orange-600">{dish.category?.name || "Không có"}</span>
                                            </p>

                                            {/* Mô tả + scroll trong card */}
                                            <DishDescription dish={dish} />

                                            <button
                                                onClick={() => router.push(`/menu/${dish.id}`)}
                                                className="mt-3 w-full px-3 py-2 font-semibold text-sm border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition"
                                            >
                                                Xem thêm chi tiết
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
        </div>
    );
}
