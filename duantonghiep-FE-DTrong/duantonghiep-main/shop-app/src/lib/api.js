export const API_URL = "http://localhost:8000/api";

export async function login(emailOrPhone, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email_or_phone: emailOrPhone, password }),
  });

  if (!res.ok) throw new Error("Đăng nhập thất bại");
  return await res.json();
}

export async function register(data) {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Đăng ký thất bại");
  return await res.json();
}
