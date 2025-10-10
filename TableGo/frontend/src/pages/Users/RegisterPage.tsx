import axios from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (password !== confirmPassword) {
      alert("Mật khẩu nhập lại không khớp! Vui lòng kiểm tra lại.");
      return;
    }

    try {
      const res = await axios.get(`http://localhost:5000/users?email=${email}`);
      if (res.data.length > 0) {
        alert("Email đã tồn tại!");
        return;
      }

      await axios.post("http://localhost:5000/users", {
        name,
        email,
        password,
        role: "user",
      });

      alert("Đăng ký thành công 🎉");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Đăng ký thất bại!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#b88e2f] to-[#d64545]">
      <div className="bg-[#fff8f1] p-10 rounded-2xl shadow-2xl w-[420px] text-secondary">
        <h2 className="text-3xl font-bold text-center mb-8">
          Create Account ✨
        </h2>

        <form className="space-y-5" onSubmit={handleRegister}>
          <div>
            <label className="block text-left font-semibold mb-1">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-left font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-left font-semibold mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>

          {/* Thêm confirm password */}
          <div>
            <label className="block text-left font-semibold mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 placeholder-gray-500 ${
                confirmPassword && password !== confirmPassword
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
            Register
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

        {/* Button về trang chủ */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="text-primary font-medium hover:(text-black underline)"
          >
            🏠 Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
