import axios from "axios";

const API_URL = "http://localhost:8000/api/branches"; // thay localhost nếu backend của m chạy port khác

// Lấy danh sách chi nhánh
export const getBranches = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

// Lấy chi tiết 1 chi nhánh
export const getBranchById = async (id: number) => {
  const res = await axios.get(`${API_URL}/${id}`);
  return res.data;
};

// Thêm chi nhánh mới
export const createBranch = async (data: {
  name: string;
  address?: string;
  phone?: string;
  image?: string;
}) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

// Cập nhật chi nhánh
export const updateBranch = async (
  id: number,
  data: {
    name?: string;
    address?: string;
    phone?: string;
    image?: string;
  }
) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

// Xóa chi nhánh
export const deleteBranch = async (id: number) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};
