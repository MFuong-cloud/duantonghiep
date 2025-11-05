import axiosClient from "@/lib/axiosClient";

export const AuthService = {
  async register(
    name: string,
    email: string,
    phone: string,
    password: string,
    confirmPassword: string
  ) {
    try {
      // ✅ Gửi đúng các field backend yêu cầu
      const response = await axiosClient.post("/auth/register", {
        name,
        email: email || null, // Gửi null nếu trống
        phone: phone || null, // Gửi null nếu trống
        password,
        password_confirmation: confirmPassword,
      });

      return { ok: true, payload: response.data };
    } catch (error: any) {
      console.error("❌ Lỗi đăng ký:", error.response?.data || error.message);
      return { ok: false, payload: error.response?.data || { message: "Lỗi đăng ký" } };
    }
  },
};
