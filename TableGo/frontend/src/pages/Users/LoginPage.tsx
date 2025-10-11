
import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

const AuthPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ emailOrPhone?: string; password?: string }>({});
  const navigate = useNavigate();

  const getCurrentUser = () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  };

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    let hasError = false;
    const newErrors: typeof errors = {};

    if (!emailOrPhone.trim()) {
      newErrors.emailOrPhone = "Bắt buộc";
      hasError = true;
    }
    if (!password.trim()) {
      newErrors.password = "Bắt buộc";
      hasError = true;
    }

    if (hasError) {
      setErrors(newErrors);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email_or_phone: emailOrPhone,
        password,
      });

      const user = res.data.user;
      const token = res.data.access_token;

      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("token", token);

      alert("Đăng nhập thành công!");

      if (user.roles.some((r: any) => r.name === "admin")) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Đăng nhập thất bại!");
    }
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
      await axios.post(
        `${API_URL}/auth/logout`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      alert("Đăng xuất thành công!");
      navigate("/login");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Đăng xuất thất bại!");
    }
  };

  const user = getCurrentUser();
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#b88e2f] to-[#d64545]">
        <h2 className="text-3xl font-bold mb-6">Xin chào, {user.name} 👋</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg"
        >
          Đăng xuất
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#b88e2f] to-[#d64545]">
      <div className="bg-[#fff8f1] p-10 rounded-2xl shadow-2xl w-[400px] text-secondary">
        <h2 className="text-3xl font-bold text-center mb-8">Chào mừng trở lại 👋</h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-left font-semibold mb-1">
              Email hoặc SĐT <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 ${
                errors.emailOrPhone ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập email hoặc số điện thoại"
            />
            {errors.emailOrPhone && (
              <p className="text-red-500 text-sm mt-1">{errors.emailOrPhone}</p>
            )}
          </div>
          <div>
            <label className="block text-left font-semibold mb-1">
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500 ${
                errors.password ? "border-red-500" : "border-gray-300"
              }`}
              placeholder="Nhập mật khẩu"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition"
          >
            Đăng nhập
          </button>
        </form>

        <p className="text-center mt-6">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Đăng ký
          </Link>
        </p>

        <div className="text-center mt-8">
          <Link to="/" className="text-primary font-medium hover:(text-black underline)">
            🏠 Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
