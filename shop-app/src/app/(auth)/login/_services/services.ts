import axios from "axios";

const API_URL = "http://localhost:8000/api"; // ⚠️ đổi nếu backend chạy port khác

export const AuthService = {
  // 🟢 Đăng nhập
  async login(emailOrPhoneNumber: string, password: string) {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email_or_phone: emailOrPhoneNumber,
        password: password,
      });

      return {
        ok: true,
        payload: response.data,
      };
    } catch (error: any) {
      return {
        ok: false,
        payload: error.response?.data || { message: "Lỗi đăng nhập" },
      };
    }
  },

  // 🔴 Đăng xuất
  async logout(token: string) {
    try {
      const response = await axios.post(
        `${API_URL}/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        ok: true,
        payload: response.data,
      };
    } catch (error: any) {
      return {
        ok: false,
        payload: error.response?.data || { message: "Lỗi đăng xuất" },
      };
    }
  },
};
