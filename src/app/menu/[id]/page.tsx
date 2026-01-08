"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Share2, ShoppingCart } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Thumbs, Autoplay } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import { useAuth } from "@/api/auth/AuthContext";

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';


import { DishService } from "@/api/menu/menu.service";
import { Dish } from "@/model/Dish";
import { formatPrice, getDishImages } from "@/lib/utils";
import { toast } from "sonner";
import { CustomToast } from "@/components/ui/custom-toast";
import { menuBroadcast } from "@/lib/menuBroadcast";

export default function MenuDishPage() {
  const router = useRouter();
  const { id } = useParams();
  const { isLogin } = useAuth();
  const [dish, setDish] = useState<Dish | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperType | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Initial fetch
    fetchDish();

    // Listen for real-time updates from admin via BroadcastChannel
    menuBroadcast.onUpdate((data) => {
      console.log('Received dish update:', data);
      // Refresh if this dish was updated or if it's a general update
      if (!data.id || data.id === parseInt(id as string)) {
        fetchDish();
      }
    });

    // Cleanup
    return () => {
      menuBroadcast.close();
    };
  }, [id]);

  const fetchDish = async () => {
    try {
      // Only show loading screen on initial load
      if (isInitialLoad) {
        setLoading(true);
      }
      setError(null);
      if (!id) {
        setError("ID món ăn không hợp lệ");
        return;
      }
      const dishId = typeof id === "string" ? parseInt(id) : parseInt(id[0]);
      const data = await DishService.getDish(dishId);

      const allImages = getDishImages(data);
      setImages(allImages);
      setDish(data);
    } catch (err: unknown) {
      console.error("Error fetching dish:", err);
      const errorMessage = err instanceof Error ? err.message : "Không thể tải thông tin món ăn";
      setError(errorMessage);
    } finally {
      if (isInitialLoad) {
        setLoading(false);
        setIsInitialLoad(false);
      }
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: dish?.name,
        text: `Xem món ăn: ${dish?.name}`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Đã copy link!");
    }
  };

  const handleOrder = () => {
    // Kiểm tra đăng nhập trước
    if (!isLogin) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Vui lòng đăng nhập"
          description="Bạn cần đăng nhập để đặt hàng. Đang chuyển đến trang đăng nhập..."
          type="error"
        />
      ), {
        duration: 3000,
        position: 'top-right',
      });

      // Redirect to login page after showing toast
      setTimeout(() => {
        router.push('/login');
      }, 1500);
      return;
    }

    // Kiểm tra trạng thái món ăn
    if (dish && !dish.status) {
      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Món ăn tạm thời hết hàng"
          description="Rất tiếc, món này hiện đã hết. Vui lòng chọn món khác hoặc liên hệ nhà hàng để biết thêm chi tiết."
          type="error"
        />
      ), {
        duration: 4000,
        position: 'top-right',
      });
      return;
    }

    // Lưu món vào giỏ hàng (localStorage)
    if (dish) {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find((item: any) => item.id === dish.id);

      if (existingItem) {
        existingItem.qty += 1;
      } else {
        cart.push({ ...dish, qty: 1 });
      }

      localStorage.setItem('cart', JSON.stringify(cart));

      toast.custom((t) => (
        <CustomToast
          t={t}
          title="Đã thêm vào giỏ hàng"
          description={`${dish.name} đã được thêm vào giỏ hàng`}
          type="success"
        />
      ), {
        duration: 2000,
        position: 'top-right',
      });
    }

    // Chuyển đến trang booking trực tiếp
    router.push('/booking');
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
    <main className="w-full min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* LEFT: Gallery - col-5 (42%) */}
          <div className="md:col-span-5">
            <div className="dish-gallery">
              {/* Main Slider */}
              <Swiper
                spaceBetween={0}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Thumbs, Autoplay]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                className="main-slider mb-2 rounded overflow-hidden"
              >
                {images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <div className="relative w-full aspect-[3/2] bg-gray-100 dark:bg-gray-800">
                      <Image
                        src={img}
                        alt={`${dish.name} ${idx + 1}`}
                        fill
                        className="object-cover"
                        priority={idx === 0}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Thumbnail Slider */}
              {images.length > 1 && (
                <Swiper
                  onSwiper={setThumbsSwiper}
                  spaceBetween={8}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Thumbs]}
                  className="thumbnail-slider"
                >
                  {images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="relative w-full aspect-[5/3] bg-gray-100 dark:bg-gray-800 rounded overflow-hidden cursor-pointer border-2 border-transparent hover:border-orange-500 transition-all">
                        <Image
                          src={img}
                          alt={`Thumbnail ${idx + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </div>
          </div>

          {/* RIGHT: Info - col-7 (58%) */}
          <div className="md:col-span-7 relative">
            {/* Share button */}
            <div className="dish-react absolute top-0 right-0 z-10">
              <button
                onClick={handleShare}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
                title="Chia sẻ"
              >
                <Share2 className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <div className="dish-text">
              {/* Dish label */}
              <div className="dish-label mb-3">
                <span className="dish-label-tags inline-block px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400 text-xs font-medium rounded mb-2">
                  {dish.category?.name || "Món ăn"}
                </span>
                <h1 className="dish-label-heading text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
                  {dish.name}
                </h1>
              </div>

              {/* Price */}
              <div className="dish-price mb-3">
                <div className="discount text-3xl font-bold text-red-600">
                  {formatPrice(dish.price)}
                </div>
              </div>

              {/* Category/Restaurant link */}
              {dish.category && (
                <a
                  href={`/menu?category=${dish.category.id}`}
                  className="text-blue-600 hover:text-blue-700 hover:underline mb-4 inline-block text-sm"
                >
                  {dish.category.name}
                </a>
              )}

              {/* Order button */}
              <div className="dish-quantity mt-4">
                <button
                  onClick={handleOrder}
                  className="btn-detail-phone-call btn quantity-btn w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold text-base rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Chọn ngay</span>
                </button>
              </div>


              {/* Additional info */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-500">Trạng thái:</span>
                    <span className={`ml-2 font-semibold ${dish.status !== false ? 'text-green-600' : 'text-red-600'}`}>
                      {dish.status !== false ? 'Còn hàng' : 'Hết hàng'}
                    </span>
                  </div>
                  {dish.created_at && (
                    <div>
                      <span className="text-gray-500">Ngày tạo:</span>
                      <span className="ml-2 font-semibold text-gray-700">
                        {new Date(dish.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Description - Full width below */}
        {dish.description && (
          <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Mô tả món ăn</h2>
            <div className="prose prose-sm max-w-none overflow-hidden">
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                {dish.description}
              </p>
            </div>
          </div>
        )}

        {/* Ghi chú / Notes Section - Pasgo Style */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Ghi chú</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Phù hợp:</span> Ăn gia đình | Tụ tập bạn bè | Họp nhóm | Hẹn hò | Tiếp khách | Tổ chức sinh nhật
          </div>
        </div>

        {/* Map/Address Section */}
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm p-5">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Địa chỉ nhà hàng</h2>

          <div className="flex items-start gap-2 mb-3">
            <span className="icon-map flex-shrink-0 mt-0.5">
              <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-5 h-5 text-orange-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"></path>
              </svg>
            </span>
            <span className="text-gray-700 dark:text-gray-300 text-sm">
              {dish.category?.name || "Địa chỉ nhà hàng"}
            </span>
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
            (Click vào bản đồ để xem chi tiết, zoom và lấy chỉ đường. Nhấn vào icon chia sẻ để chia sẻ vị trí)
          </p>

          <div className="map-photo-content relative rounded-lg overflow-hidden">
            <a
              href="https://maps.app.goo.gl/hsY4T618UH9mG6CU6"
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="block"
            >
              <div className="w-full h-[400px] rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3724.6087449344595!2d105.81382607503205!3d21.003140080632976!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135acbf6bdc484b%3A0x8164ec071329e7f2!2sGoGi%20House%20Royal%20City!5e0!3m2!1svi!2s!4v1733304593000!5m2!1svi!2s"
                  width="100%"
                  height="100%"
                  style={{ border: 0, pointerEvents: 'none' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </a>

            <button
              onClick={handleShare}
              className="link-share absolute top-3 right-3 bg-orange-600 hover:bg-orange-700 p-2 rounded-full shadow-lg transition-all"
              title="Chia sẻ vị trí"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share-2" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="white" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M8 9h-1a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-8a2 2 0 0 0 -2 -2h-1"></path>
                <path d="M12 14v-11"></path>
                <path d="M9 6l3 -3l3 3"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Swiper custom styles */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          display: none !important;
        }

        /* Active thumbnail - full opacity with orange border */
        .thumbnail-slider .swiper-slide-thumb-active > div {
          border-color: #f97316 !important;
          opacity: 1 !important;
        }

        /* Inactive thumbnails - dimmed (Pasgo style) */
        .thumbnail-slider .swiper-slide:not(.swiper-slide-thumb-active) > div {
          opacity: 0.5;
          transition: opacity 0.3s ease;
        }

        /* Hover effect on inactive thumbnails */
        .thumbnail-slider .swiper-slide:not(.swiper-slide-thumb-active):hover > div {
          opacity: 0.75;
        }

        .dish-gallery {
          position: sticky;
          top: 20px;
        }
      `}</style>
    </main>
  );
}
