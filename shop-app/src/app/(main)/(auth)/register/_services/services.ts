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
      const response = await axiosClient.post("/auth/register", {
        name,
        email_or_phone: email || phone,
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
