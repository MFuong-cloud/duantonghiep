"use client";

import React, { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, ArrowLeft, ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AppPromoSection from "@/components/aboutSection/page";
import { DishService } from "@/api/menu/menu.service";
import { CategoryService } from "@/api/categories/category.service";
import { Dish } from "@/model/Dish";
import { Category } from "@/model/Category";
import { PRICE_RANGES, SORT_OPTIONS } from "@/constants";
import { formatPrice, getValidImageUrl } from "@/lib/utils";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";

interface MenuSection {
    category: string;
    categoryId: number;
    description: string;
    items: Dish[];
}

export default function MenuPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const queryParam = searchParams.get("q") || "";

    const [dishes, setDishes] = useState<Dish[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [menuData, setMenuData] = useState<MenuSection[]>([]);
    const [loading, setLoading] = useState(true);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    const [searchTerm, setSearchTerm] = useState(queryParam);
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [priceRange, setPriceRange] = useState<string>("all");
    const [sortOrder, setSortOrder] = useState<string>("default");

    const scrollRefs = useRef<Record<string, HTMLDivElement | null>>({});

    const fetchData = React.useCallback(async () => {
        try {

            if (isInitialLoad) {
                setLoading(true);
            }
            const [dishesData, categoriesData] = await Promise.all([
                DishService.getDishes(),
                CategoryService.getCategories()
            ]);
            setDishes(dishesData);
            setCategories(categoriesData);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            if (isInitialLoad) {
                setLoading(false);
                setIsInitialLoad(false);
            }
        }
    }, [isInitialLoad]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useRealtimeUpdates({
        serverUrl: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001',
        onMenuUpdate: () => {
         
            setTimeout(() => {
                fetchData();
            }, 500);
        }
    });

    useEffect(() => {
        if (dishes.length === 0) return;

        let filteredDishes = dishes;

        if (searchTerm) {
            const lowerQuery = searchTerm.toLowerCase();
            filteredDishes = filteredDishes.filter((dish) =>
                dish.name.toLowerCase().includes(lowerQuery) ||
                (dish.category?.name && dish.category.name.toLowerCase().includes(lowerQuery))
            );
        }

        if (selectedCategory) {
            filteredDishes = filteredDishes.filter((dish) => dish.category_id === selectedCategory);
        }

        if (priceRange !== "all") {
            const [minStr, maxStr] = priceRange.split("-");
            const min = Number(minStr);
            const max = maxStr === "inf" ? Infinity : Number(maxStr);

            filteredDishes = filteredDishes.filter((dish) => {
                const price = dish.price || 0;
                return price >= min && price < max;
            });
        }

        if (sortOrder === "asc") {
            filteredDishes.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sortOrder === "desc") {
            filteredDishes.sort((a, b) => (b.price || 0) - (a.price || 0));
        }

        const grouped: Record<number, MenuSection> = {};

        filteredDishes.forEach((dish) => {
            const catId = dish.category_id;
            if (!grouped[catId]) {
                grouped[catId] = {
                    category: dish.category?.name || `Danh mục ${catId}`,
                    categoryId: catId,
                    description: dish.category?.description || "",
                    items: [],
                };
            }
            grouped[catId].items.push(dish);
        });

        setMenuData(Object.values(grouped));
    }, [dishes, searchTerm, selectedCategory, priceRange, sortOrder]);

    useEffect(() => {
        setSearchTerm(queryParam);
    }, [queryParam]);

    const scroll = (id: string, dir: "left" | "right") => {
        const el = scrollRefs.current[id];
        if (!el) return;
        const amount = dir === "left" ? -400 : 400;
        el.scrollBy({ left: amount, behavior: "smooth" });
    };

    const handleDishClick = (dishId: number) => {
        router.push(`/menu/${dishId}`);
    };

    if (loading) {
        return (
            <main className="bg-[#fffdf7] dark:bg-[#121212] min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ffb84d] mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Đang tải thực đơn...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-[#fffdf7] dark:bg-[#121212] text-[#1a1a1a] dark:text-[#e5e5e5] min-h-screen">
            {/* Banner */}
            <div className="relative h-[450px] w-full overflow-hidden">
                <Image
                    src="/image/banner1.png"
                    alt="Menu Banner"
                    fill
                    className="object-cover brightness-75"
                />

            </div>

            <section className="container mx-auto px-6 lg:px-10 py-8">

                <div className="flex flex-col gap-8 mb-10">

                  
                    <div className="relative max-w-xl mx-auto w-full">
                        <input
                            type="text"
                            placeholder="Tìm kiếm món ăn..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#ffb84d] shadow-sm transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 w-full overflow-x-auto pb-4 scrollbar-hide">
                        <div className="flex gap-6 justify-start xl:justify-center min-w-max mx-auto">
                           
                            <div
                                onClick={() => setSelectedCategory(null)}
                                className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px] select-none outline-none"
                            >
                                <div className={`w-[70px] h-[70px] rounded-full overflow-hidden border-2 flex items-center justify-center bg-gray-100 dark:bg-gray-800 transition-all ${selectedCategory === null ? 'border-[#ffb84d]' : 'border-transparent group-hover:border-[#ffb84d]'}`}>
                                    <span className="text-xs font-bold text-gray-500">Tất cả</span>
                                </div>
                                <div className="text-center">
                                    <h3 className={`text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap ${selectedCategory === null ? 'text-[#ffb84d]' : 'text-gray-700 dark:text-gray-300 group-hover:text-[#ffb84d]'}`}>
                                        Tất cả
                                    </h3>
                                </div>
                            </div>

                          
                            {categories.map((cat) => (
                                <div
                                    key={cat.id}
                                    onClick={() => setSelectedCategory(cat.id === selectedCategory ? null : cat.id)}
                                    className="flex flex-col items-center gap-2 cursor-pointer group min-w-[80px] select-none outline-none"
                                >
                                    <div className={`w-[70px] h-[70px] rounded-full overflow-hidden border-2 transition-all relative ${selectedCategory === cat.id ? 'border-[#ffb84d]' : 'border-transparent group-hover:border-[#ffb84d]'}`}>
                                        <Image
                                            src={getValidImageUrl(cat)}
                                            alt={cat.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="text-center">
                                        <h3 className={`text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap max-w-[100px] ${selectedCategory === cat.id ? 'text-[#ffb84d]' : 'text-gray-700 dark:text-gray-300 group-hover:text-[#ffb84d]'}`}>
                                            {cat.name}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                
                <div className="space-y-20">
                    {menuData.length === 0 ? (
                        <div className="text-center py-20">
                            <p className="text-gray-600 dark:text-gray-400 text-lg">
                                Không tìm thấy món ăn nào phù hợp.
                            </p>
                        </div>
                    ) : (
                        menuData.map((section, idx) => {
                            const refId = `scroll-${idx}`;
                            return (
                                <div key={idx} className="relative group">
                                   
                                    <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                                        <h2 className="text-3xl font-semibold text-[#ffb84d]">{section.category}</h2>

                                        
                                        {idx === 0 && (
                                            <div className="flex flex-wrap gap-3">
                                               
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="px-4 py-2 h-auto rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-sm font-medium shadow-sm hover:border-[#ffb84d] transition-colors"
                                                        >
                                                            {PRICE_RANGES.find(r => r.value === priceRange)?.label || 'Lọc giá'}
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                                                        <DropdownMenuLabel>Khoảng giá</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuRadioGroup value={priceRange} onValueChange={setPriceRange}>
                                                            {PRICE_RANGES.map((range) => (
                                                                <DropdownMenuRadioItem key={range.value} value={range.value}>
                                                                    {range.label}
                                                                </DropdownMenuRadioItem>
                                                            ))}
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>

                                               
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button
                                                            variant="outline"
                                                            className="px-4 py-2 h-auto rounded-full border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1a1a] text-sm font-medium shadow-sm hover:border-[#ffb84d] transition-colors"
                                                        >
                                                            {SORT_OPTIONS.find(o => o.value === sortOrder)?.label || 'Sắp xếp'}
                                                            <ChevronDown className="ml-2 h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end" className="w-48 rounded-2xl">
                                                        <DropdownMenuLabel>Sắp xếp theo</DropdownMenuLabel>
                                                        <DropdownMenuSeparator />
                                                        <DropdownMenuRadioGroup value={sortOrder} onValueChange={setSortOrder}>
                                                            {SORT_OPTIONS.map((opt) => (
                                                                <DropdownMenuRadioItem key={opt.value} value={opt.value}>
                                                                    {opt.label}
                                                                </DropdownMenuRadioItem>
                                                            ))}
                                                        </DropdownMenuRadioGroup>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        )}
                                    </div>

                                    {selectedCategory ? (
                                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                            {section.items.map((item) => (
                                                <div key={item.id} className="group/wrapper">
                                                    <div
                                                        onClick={() => handleDishClick(item.id)}
                                                        className="cursor-pointer relative bg-white/95 dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md group-hover/wrapper:shadow-[0_8px_40px_rgba(255,184,77,0.4)] transition-all duration-500 transform group-hover/wrapper:-translate-y-2 select-none outline-none"
                                                    >
                                                        <div className="relative h-60 w-full">
                                                            <Image
                                                                src={getValidImageUrl(item)}
                                                                alt={item.name}
                                                                fill
                                                                className="object-cover group-hover/wrapper:scale-110 transition-transform duration-700"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover/wrapper:opacity-50 transition" />
                                                        </div>
                                                        <div className="p-5">
                                                            <h3 className="text-lg font-semibold mb-3 text-center group-hover/wrapper:text-[#ffb84d] transition">
                                                                {item.name}
                                                            </h3>
                                                            <div className="flex items-center justify-between gap-2">
                                                                <p className="text-[#ffb84d] font-medium text-base">
                                                                    {formatPrice(item.price)}
                                                                </p>
                                                                <span
                                                                    className={`px-3 py-1 rounded-full text-xs font-medium ${item.status
                                                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                        }`}
                                                                >
                                                                    {item.status ? "Còn hàng" : "Hết hàng"}
                                                                </span>
                                                            </div>
                                                            <button className="mt-4 w-full py-2 rounded-xl bg-[#ffb84d]/10 text-[#ffb84d] font-medium hover:bg-[#ffb84d] hover:text-white transition-colors select-none outline-none">
                                                                Xem chi tiết
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => scroll(refId, "left")}
                                                data-slot="carousel-prev"
                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 absolute size-8 rounded-full top-1/2 -left-4 -translate-y-1/2 z-10"
                                            >
                                                <ArrowLeft className="lucide lucide-arrow-left" />
                                                <span className="sr-only">Previous slide</span>
                                            </button>

                                            <button
                                                onClick={() => scroll(refId, "right")}
                                                data-slot="carousel-next"
                                                className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 absolute size-8 rounded-full top-1/2 -right-4 -translate-y-1/2 z-10"
                                            >
                                                <ArrowRight className="lucide lucide-arrow-right" />
                                                <span className="sr-only">Next slide</span>
                                            </button>

                                         
                                            <div
                                                ref={(el) => {
                                                    scrollRefs.current[refId] = el;
                                                }}
                                                id={refId}
                                                className="flex gap-6 overflow-hidden scroll-smooth pb-4 px-1"
                                            >
                                                {section.items.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="min-w-[280px] sm:min-w-[320px] snap-start group/wrapper"
                                                    >
                                                        <div
                                                            onClick={() => handleDishClick(item.id)}
                                                            className="cursor-pointer relative bg-white/95 dark:bg-[#1a1a1a] rounded-2xl overflow-hidden shadow-md group-hover/wrapper:shadow-[0_8px_40px_rgba(255,184,77,0.4)] transition-all duration-500 transform group-hover/wrapper:-translate-y-2 select-none outline-none"
                                                        >
                                                            <div className="relative h-60 w-full">
                                                                <Image
                                                                    src={getValidImageUrl(item)}
                                                                    alt={item.name}
                                                                    fill
                                                                    className="object-cover group-hover/wrapper:scale-110 transition-transform duration-700"
                                                                />
                                                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-80 group-hover/wrapper:opacity-50 transition" />
                                                            </div>
                                                            <div className="p-5">
                                                                <h3 className="text-lg font-semibold mb-3 text-center group-hover/wrapper:text-[#ffb84d] transition">
                                                                    {item.name}
                                                                </h3>
                                                                <div className="flex items-center justify-between gap-2">
                                                                    <p className="text-[#ffb84d] font-medium text-base">
                                                                        {formatPrice(item.price)}
                                                                    </p>
                                                                    <span
                                                                        className={`px-3 py-1 rounded-full text-xs font-medium ${item.status
                                                                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                                                            }`}
                                                                    >
                                                                        {item.status ? "Còn hàng" : "Hết hàng"}
                                                                    </span>
                                                                </div>
                                                                <button className="mt-4 w-full py-2 rounded-xl bg-[#ffb84d]/10 text-[#ffb84d] font-medium hover:bg-[#ffb84d] hover:text-white transition-colors select-none outline-none">
                                                                    Xem chi tiết
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </section>

            {/* Promo Section */}
            <AppPromoSection />
        </main >
    );
}
