"use client";

import { useEffect } from 'react';
import { CheckCircle, XCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

export const NotificationToast = ({ message, type, onClose }: ToastProps) => {
  // Tự động đóng sau 3 giây
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const isSuccess = type === 'success';

  return (
    <div className={`fixed top-6 right-6 z-50 w-full max-w-sm overflow-hidden rounded-lg shadow-lg 
      ${isSuccess ? 'bg-green-500' : 'bg-red-500'} 
      text-white animate-fade-in-right`}
    >
      <div className="p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            {isSuccess ? <CheckCircle className="h-6 w-6" /> : <XCircle className="h-6 w-6" />}
          </div>
          <div className="ml-3 w-0 flex-1 pt-0.5">
            <p className="text-sm font-semibold">{message}</p>
          </div>
          <div className="ml-4 flex flex-shrink-0">
            <button
              onClick={onClose}
              className="inline-flex rounded-md text-white/70 hover:text-white focus:outline-none"
            >
              <span className="sr-only">Close</span>
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
