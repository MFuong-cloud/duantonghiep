import axiosClient from "@/lib/axiosClient";

export const AuthService = {
  async login(emailOrPhoneNumber: string, password: string) {
    try {
      const response = await axiosClient.post("/auth/login", {
        email_or_phone: emailOrPhoneNumber,
        password,
      });
      return { ok: true, payload: response.data };
    } catch (error: any) {
      console.error("❌ Lỗi đăng nhập:", error.response?.data || error.message);
      return { ok: false, payload: error.response?.data || { message: "Lỗi đăng nhập" } };
    }
  },

  async logout(token: string) {
    try {
      const response = await axiosClient.post(
        "/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return { ok: true, payload: response.data };
    } catch (error: any) {
      console.error("❌ Lỗi đăng xuất:", error.response?.data || error.message);
      return { ok: false, payload: error.response?.data || { message: "Lỗi đăng xuất" } };
    }
  },
};
