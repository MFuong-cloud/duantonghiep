import axios from "axios";

const API_URL = "http://localhost:8000/api";

export const AuthService = {
  // 🟢 Đăng ký tài khoản mới
  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) {
    try {
      // ⚠️ Backend Laravel của bạn yêu cầu field "email_or_phone" chứ không phải "email" + "phone" riêng lẻ
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email_or_phone: email || phone,
        password,
      });

      return {
        ok: true,
        payload: response.data,
      };
    } catch (error: any) {
      console.error("❌ Lỗi đăng ký:", error.response?.data || error.message);
      return {
        ok: false,
        payload: error.response?.data || { message: "Lỗi đăng ký" },
      };
    }
  },
};
