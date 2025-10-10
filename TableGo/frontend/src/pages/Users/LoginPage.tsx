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
