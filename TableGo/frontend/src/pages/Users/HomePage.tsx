const HomePage = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero */}
      <section className="bg-restaurant text-black py-20 px-8 flex flex-col md:flex-row items-center justify-between">
        <div className="md:w-1/2 flex justify-center mb-8 md:mb-0">
          <img
            src="https://i.pinimg.com/736x/b0/9f/15/b09f158f5409f6f1786d2378734fd0c5.jpg"
            alt="Ramen Bowl"
            className="w-96 h-96 object-cover rounded-full shadow-lg"
          />
        </div>

        <div className="md:w-1/2 text-center md:text-left">
          <h2 className="text-5xl font-bold leading-tight mb-4">
            Ramen Hot, <span className="text-secondary">Hit the Spot.</span>
          </h2>
          <p className="text-lg mb-6">
            Featuring our new{" "}
            <span className="text-secondary font-semibold">
              Spring Specials
            </span>{" "}
            🍤
          </p>
          <button className="bg-secondary hover:bg-accent text-white px-6 py-3 rounded-full font-semibold transition">
            Order Now
          </button>
        </div>
      </section>

      {/* About */}
      <section className="py-16 px-8 text-center bg-light">
        <h3 className="text-3xl font-bold text-primary mb-6">
          Our Signature Dishes 🍜
        </h3>
        <p className="max-w-2xl mx-auto text-gray-600 mb-12">
          Explore our most loved ramen bowls — each crafted with authentic
          Japanese ingredients and a touch of passion.
        </p>

        {/* Grid món ăn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              img: "https://i.pinimg.com/736x/33/26/a2/3326a2dc3520593cd27b59928bf65c92.jpg",
              name: "Tonkotsu Ramen",
              price: 39,
            },
            {
              img: "https://i.pinimg.com/1200x/0b/78/db/0b78db4391724c8d2f7bc5bc3ef89fdc.jpg",
              name: "Shoyu Ramen",
              price: 49,
            },
            {
              img: "https://i.pinimg.com/736x/26/f1/19/26f119326fc93d7b4a387c3b4dedb75a.jpg",
              name: "Spicy Miso Ramen",
              price: 79,
            },
            {
              img: "https://i.pinimg.com/736x/99/4e/08/994e08e8b83cac19310f117a9ab593a3.jpg",
              name: "Vegan Ramen",
              price: 29,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:scale-105 transform transition duration-300"
            >
              <img
                src={item.img}
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
      </section>
    </div>
  );
};

export default HomePage;
