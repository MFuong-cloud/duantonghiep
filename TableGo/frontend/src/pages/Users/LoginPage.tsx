import axios from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = "http://127.0.0.1:8000/api";

const LoginPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    emailOrPhone?: string;
    password?: string;
  }>({});
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
        <h2 className="text-3xl font-bold text-center mb-8">
          Chào mừng trở lại 👋
        </h2>
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

        {/* Social Login */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-secondary">Hoặc đăng nhập bằng</p>

          {/* Bọc 2 nút trong 1 flex container */}
          <div className="flex items-center justify-center gap-4">
            {/* Nút Google */}
            <button
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:8000/api/auth/google/redirect")
              }
              className="group flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#4285F4] text-white font-semibold transition-all duration-300 hover:bg-primary hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.64 2.55 30.14 0 24 0 14.64 0 6.64 5.84 2.69 14.09l7.98 6.21C12.47 13.27 17.74 9.5 24 9.5z"
                />
                <path
                  fill="#4285F4"
                  d="M46.14 24.49c0-1.56-.14-3.06-.41-4.49H24v8.51h12.45c-.54 2.77-2.16 5.11-4.62 6.68l7.04 5.47C43.56 36.59 46.14 30.91 46.14 24.49z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.67 28.3a13.98 13.98 0 0 1 0-8.6l-7.98-6.21A24.004 24.004 0 0 0 0 24c0 3.89.93 7.57 2.69 10.51l7.98-6.21z"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.14 0 11.64-2.02 15.52-5.48l-7.04-5.47C30.24 38.49 27.24 39.5 24 39.5c-6.26 0-11.53-3.77-13.33-9.11l-7.98 6.21C6.64 42.16 14.64 48 24 48z"
                />
              </svg>
              <span className="font-medium">Google</span>
            </button>

            {/* Nút Facebook */}
            <button
              onClick={() =>
                (window.location.href =
                  "http://127.0.0.1:8000/api/auth/facebook/redirect")
              }
              className="group flex-1 flex items-center justify-center gap-2 py-3 rounded-lg bg-[#1877F2] text-white font-semibold transition-all duration-300 hover:bg-primary hover:shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                className="w-5 h-5 transform transition-transform duration-300 group-hover:scale-110"
              >
                <path
                  fill="currentColor"
                  d="M22 12a10 10 0 1 0-11.5 9.9v-7h-2v-3h2v-2.3c0-2 1.2-3.1 3-3.1.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2V12h2.3l-.4 3h-1.9v7A10 10 0 0 0 22 12"
                />
              </svg>
              <span className="font-medium">Facebook</span>
            </button>
          </div>
        </div>

        <p className="text-center mt-6">
          Chưa có tài khoản?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Đăng ký
          </Link>
        </p>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-primary font-medium hover:(text-black underline)"
          >
            🏠 Trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
