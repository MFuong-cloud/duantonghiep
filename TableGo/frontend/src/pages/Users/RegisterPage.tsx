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

  // Save state ra localStorage khi input thay đổi
  useEffect(() => {
    localStorage.setItem("reg_name", name);
    localStorage.setItem("reg_phone", phone);
    localStorage.setItem("reg_email", email);
    localStorage.setItem("reg_password", password);
    localStorage.setItem("reg_confirmPassword", confirmPassword);
  }, [name, phone, email, password, confirmPassword]);

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
