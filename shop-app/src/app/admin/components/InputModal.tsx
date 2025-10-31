"use client";

import { useState, useEffect } from 'react';

interface InputModalProps {
  title: string;
  initialValue?: string;
  onSubmit: (value: string) => void;
  onCancel: () => void;
}

export const InputModal = ({ title, initialValue = "", onSubmit, onCancel }: InputModalProps) => {
  const [value, setValue] = useState(initialValue);

  // Cập nhật giá trị nếu prop initialValue thay đổi (quan trọng cho việc edit)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) {
      onSubmit(value.trim());
    } else {
      alert("Tên không được để trống.");
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <form 
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{title}</h3>
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-700 focus:outline-none focus:ring-amber-500 focus:border-amber-500"
            autoFocus
          />
        </div>
        <div className="flex items-center justify-end gap-4 bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-amber-600 text-white font-semibold rounded-lg shadow-md hover:bg-amber-700 transition-colors"
          >
            Lưu
          </button>
        </div>
      </form>
    </div>
  );
};
