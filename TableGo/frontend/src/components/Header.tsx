import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
          // withCredentials: true // Bỏ nếu không dùng cookie Sanctum
        }
      );

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      setUser(null);
      navigate("/login");
      alert("Đăng xuất thành công!");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Đăng xuất thất bại!");
    }
  };

  return (
    <header className="bg-light shadow-md sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between py-4 px-6">
        <Link to="/">
          <h1 className="text-2xl font-serif text-primary">TableGo</h1>
        </Link>
        <ul className="flex gap-6 text-secondary font-medium">
          <li>
            <Link to="/menu">Thực đơn</Link>
          </li>
          <li>
            <Link to="/booking">Đặt bàn</Link>
          </li>
          <li>
            <Link to="/contact">Liên hệ</Link>
          </li>

          {!user ? (
            <li>
              <Link to="/login" className="text-primary hover:underline">
                Đăng nhập
              </Link>
            </li>
          ) : (
            <li className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 text-secondary font-semibold bg-transparent hover:bg-primary hover:text-black transition-colors duration-200 rounded-lg px-3 py-2 leading-none"
              >
                👤 {user.name || "User"}
              </button>

              {/* Dropdown menu */}
              {showMenu && (
                <ul className="absolute right-0 mt-2 w-52 bg-white border border-primary rounded-xl shadow-lg overflow-hidden">
                  <li>
                    <Link
                      to="/profile"
                      onClick={() => setShowMenu(false)}
                      className="block px-4 py-2 text-secondary font-medium hover:bg-primary hover:text-white transition-colors duration-200"
                    >
                      Thông tin khách hàng
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-secondary font-medium hover:bg-red-500 hover:text-white transition-colors duration-200"
                    >
                      Đăng xuất
                    </button>
                  </li>
                </ul>
              )}
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
