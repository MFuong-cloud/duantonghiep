import { useEffect, useState, useRef } from "react";

const HomePage = () => {
  // State cho banner slide
  const banners = [
    "https://i.pinimg.com/736x/b0/9f/15/b09f158f5409f6f1786d2378734fd0c5.jpg",
    "https://i.pinimg.com/1200x/60/bd/35/60bd35de9e0a9b4573febfbed220508a.jpg",
    "https://i.pinimg.com/736x/e0/a2/15/e0a215c423815d9aeaaeb1f3a49ea4dc.jpg",
  ];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  // State cho product slider
  const [dishes, setDishes] = useState<
    { id: number; image: string; name: string; price: number }[]
  >([]); // Thêm type cho state
  const [currentDishPage, setCurrentDishPage] = useState(0);
  const dishIntervalRef = useRef<number | undefined>(undefined);

  const ITEMS_PER_PAGE = 4;
  const totalDishPages = Math.ceil(dishes.length / ITEMS_PER_PAGE);

  // useEffect cho banner
  useEffect(() => {
    const bannerInterval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(bannerInterval);
  }, [banners.length]);

  // useEffect để fetch dữ liệu món ăn
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const response = await fetch("/db.json");
        const data = await response.json();
        setDishes(data.menu);
      } catch (error) {
        console.error("Failed to fetch dishes:", error);
      }
    };
    fetchDishes();
  }, []);

  // Hàm reset interval được tái sử dụng
  const startInterval = () => {
    // Xóa interval cũ trước khi tạo cái mới
    if (dishIntervalRef.current) {
      clearInterval(dishIntervalRef.current);
    }

    dishIntervalRef.current = setInterval(() => {
      setCurrentDishPage((prev) => (prev + 1) % totalDishPages);
    }, 5000);
  };

  // useEffect cho slider món ăn tự động chuyển
  useEffect(() => {
    if (totalDishPages > 1) {
      startInterval(); // Bắt đầu interval
    }
    // Dọn dẹp interval khi component unmount
    return () => {
      if (dishIntervalRef.current) {
        clearInterval(dishIntervalRef.current);
      }
    };
  }, [totalDishPages]);

  // Hàm điều khiển slider
  const goToNextPage = () => {
    setCurrentDishPage((prev) => (prev + 1) % totalDishPages);
    startInterval(); // Reset interval khi người dùng tương tác
  };

  const goToPrevPage = () => {
    setCurrentDishPage((prev) => (prev - 1 + totalDishPages) % totalDishPages);
    startInterval(); // Reset interval khi người dùng tương tác
  };

  // Tính toán các món ăn sẽ hiển thị trên trang hiện tại
  const startIndex = currentDishPage * ITEMS_PER_PAGE;
  const currentDishes = dishes.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="bg-white text-gray-800 py-18 px-6">
      {/* Banner Slide */}
      <section className="relative w-full h-[500px] overflow-hidden">
        {banners.map((url, index) => (
          <img
            key={index}
            src={url}
            alt={`Banner ${index + 1}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
              index === currentBannerIndex ? "opacity-100" : "opacity-0"
            }`}
          />
        ))}
      </section>

      {/* About */}
      <section className="py-16 px-8 text-center bg-light">
        <div className="max-w-6xl mx-auto" >
          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-primary">
              Our Signature Dishes 🍜
            </h3>
          </div>

          <p className="max-w-2xl mx-auto text-gray-600 mb-12">
            Explore our most loved ramen bowls — each crafted with authentic
            Japanese ingredients and a touch of passion.
          </p>
        </div>

        <div className="max-w-6xl mx-auto"> 
          <div className="flex justify-end mb-4">
            {/* Nút điều khiển Slider */}
            {totalDishPages > 1 && (
              <div className="flex gap-2">
                <button
                  onClick={goToPrevPage}
                  className="bg-gray-200 hover:bg-primary hover:text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                  aria-label="Previous Dishes"
                >
                  &#8592;
                </button>
                <button
                  onClick={goToNextPage}
                  className="bg-gray-200 hover:bg-primary hover:text-white rounded-full w-10 h-10 flex items-center justify-center transition"
                  aria-label="Next Dishes"
                >
                  &#8594;
                </button>
              </div>
            )}
          </div>
          {/* Grid món ăn */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {currentDishes.map((item) => (
              <div
                key={item.id}
                className="bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transform transition duration-300"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold mb-2 text-secondary">
                    {item.name}
                  </h4>
                  <p className="text-xl font-semibold mb-2 text-secondary">
                    ${item.price}
                  </p>
                  <button className="bg-primary hover:bg-secondary text-white px-5 py-2 rounded-full font-semibold transition">
                    Order Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
