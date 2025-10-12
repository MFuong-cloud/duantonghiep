import axios from "axios";
import { useState, useEffect, type FormEvent } from "react";
import Header from "../../components/Header";

const BookingPage = () => {
  // Dữ liệu giả lập

  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [selectedMenu, setSelectedMenu] = useState<number[]>([]);

  // Thông tin khách hàng
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
    notes: "",
  });

  const [tables, setTables] = useState<
    { id: number; status: "booked" | "available" }[]
  >([]);
  const [menu, setMenu] = useState<
    { id: number; name: string; price: number; image: string }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tablesRes, menuRes] = await Promise.all([
          axios.get("http://localhost:5000/tables"),
          axios.get("http://localhost:5000/menu"),
        ]);
        setTables(tablesRes.data);
        setMenu(menuRes.data);
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
      }
    };

    fetchData();
  }, []);

  const handleSelectTable = (id: number, status: string) => {
    if (status === "booked") return;
    setSelectedTable(id);
  };

  const toggleMenuItem = (id: number) => {
    setSelectedMenu((prev) =>
      prev.includes(id) ? prev.filter((m) => m !== id) : [...prev, id]
    );
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooking = (e: FormEvent) => {
    e.preventDefault();

    if (!selectedTable) {
      alert("⚠️ Vui lòng chọn bàn trước!");
      return;
    }

    if (!customer.name || !customer.phone || !customer.date || !customer.time) {
      alert("⚠️ Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    const chosenMenu = menu.filter((m) => selectedMenu.includes(m.id));

    alert(
      `✅ Đặt bàn thành công!\n\n👤 Tên: ${customer.name}\n📞 SĐT: ${
        customer.phone
      }\n🗓️ Ngày: ${customer.date} - ${
        customer.time
      }\n🍽️ Bàn: ${selectedTable}\nMón: ${
        chosenMenu.length
          ? chosenMenu.map((m) => m.name).join(", ")
          : "Không chọn món"
      }\n\nGhi chú: ${customer.notes || "Không có"}`
    );

    // Reset form (sau này thay bằng gọi API POST)
    setCustomer({ name: "", phone: "", date: "", time: "", notes: "" });
    setSelectedTable(null);
    setSelectedMenu([]);
  };

  return (
   
    <div className="min-h-screen bg-[#fff8f1] py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Tiêu đề */}
        <h2 className="text-3xl font-serif text-center text-primary mb-10">
          Đặt Bàn Tại Nhà Hàng
        </h2>

        {/* Sơ đồ bàn */}
        <div className="grid grid-cols-4 gap-6 justify-items-center mb-12">
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => handleSelectTable(table.id, table.status)}
              className={`w-24 h-24 flex items-center justify-center rounded-xl cursor-pointer text-white text-lg font-semibold shadow-md transition-all duration-300
                ${
                  table.status === "booked"
                    ? "bg-red-500 cursor-not-allowed"
                    : selectedTable === table.id
                    ? "bg-yellow-500 scale-105"
                    : "bg-gray-400 hover:bg-yellow-500 hover:scale-105"
                }`}
            >
              Bàn {table.id}
            </div>
          ))}
        </div>

        {/* Thực đơn */}
        <h3 className="text-2xl font-serif text-center text-secondary mb-6">
          Thực Đơn 
        </h3>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10">
          {menu.map((item) => (
            <div
              key={item.id}
              onClick={() => toggleMenuItem(item.id)}
              className={`border rounded-xl shadow-md overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 ${
                selectedMenu.includes(item.id) ? "ring-2 ring-yellow-500" : ""
              }`}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-40 object-cover"
              />
              <div className="p-3 text-center">
                <h4 className="font-semibold text-secondary">{item.name}</h4>
                <p className="text-primary font-bold mt-1">
                  ${item.price.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Form thông tin khách hàng */}
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 border border-primary">
          <h3 className="text-2xl font-serif text-primary mb-6 text-center">
            Thông Tin Đặt Bàn
          </h3>

          <form onSubmit={handleBooking} className="space-y-5">
            <div>
              <label className="block text-primary font-semibold mb-1">
                Họ và tên
              </label>
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                className="w-full p-3 border  border-amber-200 text-secondary rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div>
              <label className="block text-primary font-semibold mb-1">
                Số điện thoại
              </label>
              <input
                type="tel"
                name="phone"
                value={customer.phone}
                onChange={handleChange}
                className="w-full p-3 border  border-amber-200 text-secondary rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="Nhập số điện thoại"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-primary font-semibold mb-1">
                  Ngày đặt
                </label>
                <input
                  type="date"
                  name="date"
                  value={customer.date}
                  onChange={handleChange}
                  className="w-full p-3 border border-amber-200 text-gray-500 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block  text-primary font-semibold mb-1">
                  Giờ đặt
                </label>
                <input
                  type="time"
                  name="time"
                  value={customer.time}
                  onChange={handleChange}
                  className="w-full p-3 border  border-amber-200 text-secondary rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block  text-primary font-semibold mb-1">
                Ghi chú (tuỳ chọn)
              </label>
              <textarea
                name="notes"
                value={customer.notes}
                onChange={handleChange}
                className="w-full p-3 border  border-amber-200 text-secondary rounded-lg focus:ring-2 focus:ring-primary outline-none"
                placeholder="VD: Thêm 1 ghế trẻ em, sinh nhật, ..."
              ></textarea>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow-500 text-white font-semibold py-3 rounded-xl hover:bg-yellow-600 transition"
            >
              Xác Nhận Đặt Bàn
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
