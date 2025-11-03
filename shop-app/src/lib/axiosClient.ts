import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000/api", // ✅ Laravel chạy port 8000
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: false, // nếu có Sanctum thì đổi thành true
});

export default axiosClient;
