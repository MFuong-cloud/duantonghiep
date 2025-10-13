import { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

interface Table {
  id: number;
  name: string;
  status: "available" | "booked" | "selected";
}

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
}

const BookingPage = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/tables")
      .then((res) => setTables(res.data))
      .catch((err) => console.error("Lỗi khi tải dữ liệu bàn:", err));

    axios
      .get("http://localhost:5000/menu")
      .then((res) => setMenu(res.data))
      .catch((err) => console.error("Lỗi khi tải dữ liệu menu:", err));
  }, []);

  const handleTableClick = (table: Table) => {
    if (table.status === "booked") {
      Swal.fire({
        icon: "warning",
        title: "Bàn đã được đặt!",
        text: `${table.name} hiện đã có người đặt.`,
        confirmButtonColor: "#d33",
      });
      return;
    }

    if (table.status === "selected") {
      Swal.fire({
        icon: "warning",
        title: "Bàn đang được chọn!",
        text: `${table.name} hiện đang được chọn.`,
        confirmButtonColor: "#d33",
      });
      return;
    }

    Swal.fire({
      title: `Đặt ${table.name}`,
      html: `
        <input type="text" id="customer-name" class="swal2-input" placeholder="Họ và tên" />
        <input type="tel" id="customer-phone" class="swal2-input" placeholder="Số điện thoại" />
        <input type="date" id="booking-date" class="swal2-input" />
        <select id="booking-time" class="swal2-input">
          <option value="">-- Chọn khung giờ --</option>
          <option value="10:00-12:00">10:00 - 12:00</option>
          <option value="12:00-14:00">12:00 - 14:00</option>
          <option value="18:00-20:00">18:00 - 20:00</option>
          <option value="20:00-22:00">20:00 - 22:00</option>
        </select>
        <textarea id="booking-notes" class="swal2-textarea" placeholder="Ghi chú (tuỳ chọn)"></textarea>
      `,
      showCancelButton: true,
      confirmButtonText: "Xác nhận đặt bàn ✅",
      cancelButtonText: "Hủy",
      confirmButtonColor: "#b88e2f",
      cancelButtonColor: "#6c757d",
      preConfirm: () => {
        const name = (
          document.getElementById("customer-name") as HTMLInputElement
        ).value.trim();
        const phone = (
          document.getElementById("customer-phone") as HTMLInputElement
        ).value.trim();
        const date = (
          document.getElementById("booking-date") as HTMLInputElement
        ).value;
        const time = (
          document.getElementById("booking-time") as HTMLSelectElement
        ).value;
        const notes = (
          document.getElementById("booking-notes") as HTMLTextAreaElement
        ).value.trim();

        if (!name || !phone || !date || !time) {
          Swal.showValidationMessage("⚠️ Vui lòng nhập đầy đủ thông tin!");
          return;
        }

        return { name, phone, date, time, notes };
      },
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const { name, phone, date, time, notes } = result.value;

        // 🔹 Cập nhật trạng thái bàn thành booked
        const updatedTables = tables.map((t) =>
          t.id === table.id ? { ...t, status: "booked" as "booked" } : t
        );
        setTables(updatedTables);

        // 🔹 Hiển thị thông báo
        Swal.fire({
          icon: "success",
          title: "🎉 Đặt bàn thành công!",
          html: `
            <p><b>👤 Tên:</b> ${name}</p>
            <p><b>📞 SĐT:</b> ${phone}</p>
            <p><b>🗓️ Ngày:</b> ${date}</p>
            <p><b>⏰ Giờ:</b> ${time}</p>
            <p><b>🪑 Bàn:</b> ${table.name}</p>
            <p><b>📝 Ghi chú:</b> ${notes || "Không có"}</p>
          `,
          confirmButtonColor: "#b88e2f",
        });
      }
    });
  };

  return (
    <div className="min-h-screen bg-[#fff8f1] py-10">
      <h1 className="text-3xl font-bold text-center mb-10 text-[#b88e2f]">
        Sơ đồ đặt bàn 🍽️
      </h1>

      <div className="grid grid-cols-4 md:grid-cols-5 gap-8 justify-items-center px-6">
        {tables.map((table) => (
          <div
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={`w-24 h-24 flex items-center justify-center rounded-full text-white font-bold text-lg cursor-pointer shadow-lg transition-transform duration-300 hover:scale-110 ${
              table.status === "booked"
                ? "bg-red-500 cursor-not-allowed"
                : table.status === "selected"
                ? "bg-purple-500 hover:bg-purple-600"
                : "bg-gray-400 hover:bg-[#b88e2f]"
            }`}
          >
            {table.name}
          </div>
        ))}
      </div>

      {/* Gợi ý màu trạng thái */}
      <div className="flex justify-center gap-6 mt-10 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-gray-400 rounded-full inline-block"></span>
          <span>Bàn trống</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-purple-500 rounded-full inline-block"></span>
          <span>Bàn đang chọn</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 bg-red-500 rounded-full inline-block"></span>
          <span>Bàn đã đặt</span>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
