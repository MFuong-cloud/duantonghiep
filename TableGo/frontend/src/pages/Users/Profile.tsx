import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const ProfilePage = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user)
    return <p className="text-center mt-10">Vui lòng đăng nhập trước.</p>;

  return (
    <div className="max-w-md mx-auto mt-10 bg-primary p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-white">
        Thông tin khách hàng
      </h2>
      <p>
        <strong>Tên:</strong> {user.name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Vai trò:</strong> {user.role}
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
  );
};

export default ProfilePage;
