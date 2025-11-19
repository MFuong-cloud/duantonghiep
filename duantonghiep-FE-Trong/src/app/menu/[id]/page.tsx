"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import BookingForm from "@/components/booking-form";
import AppPromoSection from "@/components/aboutSection/page";
import { Tag, Star } from "lucide-react";

export default function MenuDishPage() {
  const router = useRouter();
  const { id } = useParams();

  const fakeDish = {
    id: id,
    category_id: 1,
    name: "Bò lúc lắc khoai tây",
    description:
      "Món bò lúc lắc đậm đà, được chế biến từ thịt bò tươi mềm, xào cùng ớt chuông và hành tây, ăn kèm khoai tây chiên vàng giòn.",
    price: 129000,
    created_at: "2025-01-01",
    updated_at: "2025-02-01",
    image_url: "/image/food/food.jpg",
    is_active: true,
    rating: 4.8,
    rating_count: 230,
  };

  const formatVND = (value) => {
    if (!value) return "Liên hệ";
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const dish = fakeDish;

  return (
    <main className="w-full min-h-screen bg-gray-50">
      {/* ảnh trên cùng */}
      <div className="relative w-full h-[300px] md:h-[380px] lg:h-[420px]">
        <Image
          src={dish.image_url}
          alt={dish.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <section className="container mx-auto px-6 lg:px-10 pt-16 pb-10 lg:flex lg:flex-row gap-12">
        <div className="lg:basis-[60%] space-y-10">
          {/* thông tin */}
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <Image
              src={dish.image_url}
              alt={dish.name}
              width={380}
              height={260}
              className="rounded-xl shadow-md object-cover"
            />

            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-bold text-gray-900">{dish.name}</h1>

              <div className="flex items-center text-yellow-500 gap-2">
                <Star className="w-5 h-5 fill-yellow-500" />
                <p className="text-lg font-semibold">
                  {dish.rating} / 5 • {dish.rating_count} đánh giá
                </p>
              </div>

              <div className="flex items-center gap-2 text-gray-700">
                <Tag className="w-5 h-5 text-orange-500" />
                <p className="text-lg">Danh mục ID: {dish.category_id}</p>
              </div>

              <p className="text-orange-600 font-bold text-2xl">
                {formatVND(dish.price)}
              </p>

              <p className="text-gray-700">
                Trạng thái:
                <span
                  className={`ml-2 px-3 py-1 rounded-full text-sm ${
                    dish.is_active
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {dish.is_active ? "Còn hàng" : "Hết hàng"}
                </span>
              </p>

              <button
                onClick={() => router.push("/menu")}
                className="mt-2 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
              >
                Xem thêm món ăn
              </button>
            </div>
          </div>

          {/* MÔ TẢ */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Mô tả món ăn
            </h2>
            <p className="text-gray-600 leading-relaxed">{dish.description}</p>
          </div>
        </div>

        <div className="lg:basis-[40%] lg:min-h-screen relative">
          <div className="lg:sticky lg:top-10">
            <BookingForm dishName={dish.name} />
          </div>
        </div>
      </section>

      <AppPromoSection />
    </main>
  );
}
