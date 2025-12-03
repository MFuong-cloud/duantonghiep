"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import BookingForm from "@/components/booking-form";
import AppPromoSection from "@/components/aboutSection/page";
import { Tag, Star, Clock, ChefHat, ChevronLeft, ChevronRight } from "lucide-react";
import { DishService } from "@/api/menu/menu.service";
import { Dish } from "@/model/Dish";

export default function MenuDishPage() {
  const router = useRouter();
  const { id } = useParams();
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const scrollGallery = (direction: "left" | "right") => {
    const gallery = document.getElementById("thumbnail-gallery");
    if (gallery) {
      const scrollAmount = 200;
      gallery.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth"
      });
    }
  };

  useEffect(() => {
    if (id) {
      fetchDish();
    }
  }, [id]);

  // Auto-slide images every 3 seconds
  useEffect(() => {
    if (!dish || !dish.images || dish.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => {
        if (!dish || !dish.images) return prevIndex;
        const nextIndex = (prevIndex + 1) % dish.images.length;
        const nextImg = dish.images[nextIndex];
        const imgUrl = nextImg.startsWith("http") ? nextImg : `http://127.0.0.1:8000/storage/${nextImg}`;
        setSelectedImage(imgUrl);
        return nextIndex;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [dish]);

  const fetchDish = async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id) {
        setError("ID món ăn không hợp lệ");
        return;
      }
      const dishId = typeof id === "string" ? parseInt(id) : parseInt(id[0]);
      const data = await DishService.getDish(dishId);

      // Parse images if it's a string (JSON)
      if (typeof data.images === 'string') {
        try {
          data.images = JSON.parse(data.images);
        } catch (e) {
          data.images = [];
        }
      }

      setDish(data);

      let mainImage = "/image/food/food.jpg";
      if (data.image_url) {
        mainImage = data.image_url;
      } else if (data.image) {
        let imgPath = data.image;
        try {
          if (typeof imgPath === "string" && imgPath.startsWith("[") && imgPath.endsWith("]")) {
            const parsed = JSON.parse(imgPath);
            if (Array.isArray(parsed) && parsed.length > 0) imgPath = parsed[0];
          }
        } catch (e) { }

        mainImage = imgPath.startsWith("http") ? imgPath : `http://127.0.0.1:8000/storage/${imgPath}`;
      }

      setSelectedImage(mainImage);
      setCurrentImageIndex(0);
    } catch (err: any) {
      console.error("Error fetching dish:", err);
      setError(err?.message || "Không thể tải thông tin món ăn");
    } finally {
      setLoading(false);
    }
  };

  const formatVND = (value?: number) => {
    if (!value) return "Liên hệ";
    return value.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <main className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin món ăn...</p>
        </div>
      </main>
    );
  }

  if (error || !dish) {
    return (
      <main className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Không tìm thấy món ăn"}</p>
          <button
            onClick={() => router.push("/menu")}
            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700"
          >
            Quay lại thực đơn
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full min-h-screen bg-gray-50">
      {/* Ảnh banner trên cùng - Full width */}
      <div className="relative w-screen h-[400px] md:h-[500px] lg:h-[600px] -mx-[50vw] left-[50%] right-[50%] bg-gray-100">
        <Image
          src={selectedImage}
          alt={dish.name}
          fill
          className="object-cover"
          priority
        />
      </div>

      <section className="container mx-auto px-6 lg:px-10 pt-16 pb-10 lg:flex lg:flex-row gap-12">
        <div className="lg:basis-[60%] space-y-10">
          {/* Thông tin chính */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Ảnh món ăn */}
              <div className="md:w-1/2">
                <Image
                  src={selectedImage}
                  alt={dish.name}
                  width={400}
                  height={300}
                  className="rounded-xl shadow-md object-cover w-full"
                />

                {/* Gallery ảnh phụ nếu có */}
                {dish.images && dish.images.length > 0 && (
                  <div className="relative mt-4 group">
                    {/* Left Arrow */}
                    {dish.images.length > 3 && (
                      <button
                        onClick={() => scrollGallery("left")}
                        className="absolute -left-3 top-7 z-10 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Previous images"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                    )}

                    {/* Right Arrow */}
                    {dish.images.length > 3 && (
                      <button
                        onClick={() => scrollGallery("right")}
                        className="absolute -right-3 top-7 z-10 bg-gray-800 hover:bg-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 text-white p-1.5 rounded-full shadow-lg transition-all opacity-0 group-hover:opacity-100"
                        aria-label="Next images"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}

                    <div id="thumbnail-gallery" className="flex gap-2 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                      {/* All images (không trùng lặp) */}
                      {dish.images.map((img, idx) => {
                        const imgUrl = img.startsWith("http") ? img : `http://127.0.0.1:8000/storage/${img}`;
                        return (
                          <div
                            key={idx}
                            onClick={() => {
                              setSelectedImage(imgUrl);
                              setCurrentImageIndex(idx);
                            }}
                            className={`flex-shrink-0 cursor-pointer rounded-lg overflow-hidden transition-all border-2 select-none outline-none ${selectedImage === imgUrl
                              ? "border-orange-500 scale-105"
                              : "border-transparent hover:border-gray-300"
                              }`}
                          >
                            <Image
                              src={imgUrl}
                              alt={`${dish.name} ${idx + 1}`}
                              width={100}
                              height={75}
                              className="object-cover w-24 h-20"
                            />
                          </div>
                        );
                      })}
                    </div>


                  </div>
                )}
              </div>

              {/* Thông tin chi tiết */}
              <div className="md:w-1/2 flex flex-col gap-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-2">{dish.name}</h2>
                  {dish.category && (
                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Tag className="w-5 h-5 text-orange-500" />
                      <p className="text-lg">{dish.category.name}</p>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4">
                  <p className="text-orange-600 font-bold text-3xl">
                    {formatVND(dish.price)}
                  </p>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${dish.status
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                      }`}
                  >
                    {dish.status ? "Còn hàng" : "Hết hàng"}
                  </span>
                </div>

                {/* Thông tin bổ sung */}
                <div className="space-y-3 pt-4 border-t border-gray-200">
                  {dish.created_at && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">Ngày tạo:</span>
                      <span>{formatDate(dish.created_at)}</span>
                    </div>
                  )}

                  {dish.updated_at && (
                    <div className="flex items-center gap-3 text-gray-700">
                      <Clock className="w-5 h-5 text-orange-500" />
                      <span className="font-medium">Cập nhật:</span>
                      <span>{formatDate(dish.updated_at)}</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => router.push("/menu")}
                  className="mt-4 px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
                >
                  ← Quay lại thực đơn
                </button>
              </div>
            </div>
          </div>

          {/* Mô tả chi tiết */}
          {dish.description && (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Star className="w-6 h-6 text-orange-500" />
                Mô tả món ăn
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
                {dish.description}
              </p>
            </div>
          )}

          {/* Thông tin kỹ thuật */}
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Thông tin chi tiết
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm text-gray-500 mb-1">Mã món ăn</p>
                <p className="text-lg font-semibold text-gray-900">#{dish.id}</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm text-gray-500 mb-1">Giá tiền</p>
                <p className="text-lg font-semibold text-gray-900">{formatVND(dish.price)}</p>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="text-sm text-gray-500 mb-1">Trạng thái</p>
                <p className="text-lg font-semibold text-gray-900">
                  {dish.status ? "Đang phục vụ" : "Ngừng phục vụ"}
                </p>
              </div>
              {dish.category && (
                <div className="border-l-4 border-orange-500 pl-4">
                  <p className="text-sm text-gray-500 mb-1">Danh mục</p>
                  <p className="text-lg font-semibold text-gray-900">{dish.category.name}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form đặt bàn */}
        <div className="lg:basis-[40%] lg:min-h-screen relative">
          <div className="lg:sticky lg:top-10">
            <BookingForm />
          </div>
        </div>
      </section>

      <AppPromoSection />
    </main>
  );
}
