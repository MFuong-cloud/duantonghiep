import axios from "axios";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
 const [email,setEmail] = useState("");
 const [password,setPassword] = useState("");
 const navigate = useNavigate();

 const handleLogin = async(e:FormEvent)=>{
  e.preventDefault();
  try {
    const res = await axios.get(`http://localhost:5000/users?email=${email}&password=${password}`);
    if (res.data.length === 0) {
      alert ("Wrong Email or Password");
      return;
    }

    const user = res.data[0];
    localStorage.setItem("user",JSON.stringify(user));
    alert ("Login Success");

    if (user.role === "admin") {
      navigate("/admin")
    }else{
      navigate("/")
    }
  } catch (err) {
    console.log(err);
    alert("Lỗi đăng nhập!");
  }
 }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#b88e2f] to-[#d64545]">
      <div className="bg-[#fff8f1] p-10 rounded-2xl shadow-2xl w-[400px] text-secondary">
        <h2 className="text-3xl font-bold text-center mb-8">Welcome Back 👋</h2>
        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label className="block text-left font-semibold mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e)=>setEmail(e.target.value)}
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
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-primary hover:bg-secondary text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-center mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Register
          </Link>
        </p>

         {/* Button Google */}
        <div className="text-center mt-6 space-y-3">
          <p className="text-sm text-gray-500">Hoặc đăng nhập bằng</p>

          <button
            onClick={() =>
              (window.location.href =
                "http://127.0.0.1:8000/api/auth/google/redirect")
            }
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-100 transition"
          >
            {/* Logo Google nền trong suốt */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 48 48"
              className="w-5 h-5"
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
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>

            <span className="font-medium text-white">Đăng nhập với Google</span>
          </button>
        </div>

        {/* Button quay về trang chủ */}
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

export default LoginPage;
