"use client";

import { ShieldAlert } from 'lucide-react';

interface ConfirmModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal = ({ title, message, onConfirm, onCancel }: ConfirmModalProps) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center z-50">
      <div 
        className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md m-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 p-2 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-300" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-500 dark:text-gray-300">{message}</p>
        </div>
        <div className="flex items-center justify-center gap-4 bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-lg">
          <button
            onClick={onCancel}
            className="px-6 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500 transition-colors"
          >
            Hủy bỏ
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition-colors"
          >
            Xác nhận Xóa
          </button>
        </div>
      </div>
    </div>
  );
};
