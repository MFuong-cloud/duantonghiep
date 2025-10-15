import axios from "axios";
import { useState, useEffect, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const navigate = useNavigate();

  // Lấy dữ liệu từ localStorage nếu có
  const [name, setName] = useState(localStorage.getItem("reg_name") || "");
  const [phone, setPhone] = useState(localStorage.getItem("reg_phone") || "");
  const [email, setEmail] = useState(localStorage.getItem("reg_email") || "");
  const [password, setPassword] = useState(
    localStorage.getItem("reg_password") || ""
  );
  const [confirmPassword, setConfirmPassword] = useState(
    localStorage.getItem("reg_confirmPassword") || ""
  );

  // State lỗi
  const [errors, setErrors] = useState({
    name: false,
    phone: false,
    password: false,
    confirmPassword: false,
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("reg_name");
      localStorage.removeItem("reg_phone");
      localStorage.removeItem("reg_email");
      localStorage.removeItem("reg_password");
      localStorage.removeItem("reg_confirmPassword");
    };

    //Xoá dữ liệu đang điền khi trang bị đóng/reload
    window.addEventListener("beforeunload", handleBeforeUnload);

    //Xoá khi rời trang đăng ký (chuyển route)
    return () => {
      handleBeforeUnload();
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    setErrors({
      name: !name,
      phone: !phone,
      password: !password,
      confirmPassword: !confirmPassword || password !== confirmPassword,
    });

    if (
      !name ||
      !phone ||
      !password ||
      !confirmPassword ||
      password !== confirmPassword
    )
      return;

    try {
      const res = await axios.post("http://127.0.0.1:8000/api/auth/register", {
        name,
        phone,
        email: email || null,
        password,
        password_confirmation: confirmPassword,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.access_token);

      // Xóa form tạm khỏi localStorage sau khi đăng ký thành công
      localStorage.removeItem("reg_name");
      localStorage.removeItem("reg_phone");
      localStorage.removeItem("reg_email");
      localStorage.removeItem("reg_password");
      localStorage.removeItem("reg_confirmPassword");

      alert(res.data.message);

      // Redirect về HomePage
      navigate("/");
    } catch (err: any) {
      console.error(err.response?.data || err);
      if (err.response?.data?.errors) {
        const messages = Object.values(err.response.data.errors)
          .flat()
          .join("\n");
        alert(messages);
      } else if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert("Đăng ký thất bại!");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#b88e2f] to-[#d64545]">
      <div className="bg-[#fff8f1] p-10 rounded-2xl shadow-2xl w-[420px] text-secondary">
        <h2 className="text-3xl font-bold text-center mb-8">
          Create Account ✨
        </h2>

        <form className="space-y-5" onSubmit={handleRegister}>
          {/* Name */}
          <div>
            <label className="block text-left font-semibold mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500 ${
                errors.name
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
              placeholder="Enter your full name"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-left font-semibold mb-1">
              Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500 ${
                errors.phone
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
              placeholder="Enter your phone number"
            />
          </div>

          {/* Email (optional) */}
          <div>
            <label className="block text-left font-semibold mb-1">
              Email (optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500"
              placeholder="Enter your email (optional)"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-left font-semibold mb-1">
              Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500 ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
              placeholder="Enter your password"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-left font-semibold mb-1">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500 ${
                errors.confirmPassword
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-primary"
              }`}
              placeholder="Re-enter your password"
            />
            {confirmPassword && password !== confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                Mật khẩu không khớp, vui lòng nhập lại.
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition"
          >
            Đăng Ký
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
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Login
          </Link>
        </p>

        <div className="text-center mt-8">
          <Link to="/" className="text-primary font-medium hover:underline">
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
