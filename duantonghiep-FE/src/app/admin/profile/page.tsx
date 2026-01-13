"use client";

import { useState, useEffect } from "react";
import { ProfileService, UserProfile, UpdateProfileData, ChangePasswordData, Session } from "@/api/profile/profile.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import envConfig from "@/config";

export default function ProfilePage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"info" | "password" | "sessions">("info");
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [sessions, setSessions] = useState<Session[]>([]);

    

    const loadProfile = async () => {
        setLoading(true);
        const response = await ProfileService.getProfile();

        if (response.ok && response.payload.data) {
            setProfile(response.payload.data);
            setFormData({
                name: response.payload.data.name || "",
                email: response.payload.data.email || "",
                phone: response.payload.data.phone || "",
            });
            if (response.payload.data.avatar) {
                setAvatarPreview(getAvatarUrl(response.payload.data.avatar));
            }
        } else {
            toast.error("Vui lòng đăng nhập để tiếp tục");
            router.push("/login");
        }
        setLoading(false);
    };

    const loadSessions = async () => {
        const response = await ProfileService.getSessions();
        if (response.ok && response.payload.data) {
            setSessions(response.payload.data);
        }
    };

    useEffect(() => {
       
                <div className="bg-gray-100 dark:bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-gray-300 dark:border-white/20">
                    {/* Tabs */}
                    <div className="flex border-b border-gray-300 dark:border-white/20">
                        <button
                            onClick={() => setActiveTab("info")}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-all ${activeTab === "info"
                                ? "bg-purple-600 text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-white/5"
                                }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                     
                            </span>
                        </button>
                        <button
                            onClick={() => setActiveTab("sessions")}
                            className={`flex-1 py-4 px-6 text-center font-medium transition-all ${activeTab === "sessions"
                                ? "bg-purple-600 text-gray-900 dark:text-white"
                                : "text-gray-600 dark:text-purple-200 hover:bg-gray-50 dark:hover:bg-white/5"
                                }`}
                        >
                            <span className="flex items-center justify-center gap-2">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                                <svg className="w-5 h-5 text-gray-900 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleAvatarChange}
                                                    className="hidden"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{profile?.name}</h2>
                                    <p className="text-gray-500 dark:text-purple-300">{profile?.email}</p>
                                    <span className={`mt-2 px-3 py-1 rounded-full text-sm font-medium ${profile?.role === 'admin'
                                        ? 'bg-red-500/20 text-red-300 border border-red-500/50'
                                        : 'bg-blue-500/20 text-blue-300 border border-blue-500/50'
                                        }`}>
                                        {profile?.role === 'admin' ? 'Quản trị viên' : 'Người dùng'}
                                    </span>
                                </div>

                                {/* Form */}
                                <for
                        {activeTab === "password" && (
                            <div className="max-w-md mx-auto">
                                <div className="text-center mb-6">
                                    <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-600/20 rounded-full mb-4">
                                        <svg className="w-8 h-8 text-gray-400 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Đổi Mật Khẩu</h3>
                                    <p className="text-gray-500 dark:text-purple-300 text-sm">Bảo mật tài khoản của bạn</p>
                                </div>

                                <form onSubmit={handleChangePassword} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-purple-200 mb-2">
                                            Mật khẩu cũ
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.old_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                            required
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Nhập mật khẩu cũ"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-purple-200 mb-2">
                                            Mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.new_password}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Tối thiểu 6 ký tự"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 dark:text-purple-200 mb-2">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            value={passwordData.new_password_confirmation}
                                            onChange={(e) => setPasswordData({ ...passwordData, new_password_confirmation: e.target.value })}
                                            required
                                            minLength={6}
                                            className="w-full px-4 py-3 bg-gray-100 dark:bg-white/10 border border-gray-300 dark:border-white/20 rounded-lg text-gray-900 dark:text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>

                             
                                                                <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded-full border border-green-500/50">
                                                                    Hiện tại
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-purple-300">
                                                            IP: {session.ip_address}
                                                        </p>
                                                        <p className="text-xs text-gray-400 dark:text-purple-400 mt-1">
                                                            Hoạt động lần cuối: {new Date(session.last_activity).toLocaleString("vi-VN")}
                                                        </p>
                                                    </div>
                                                    {!session.is_current && (
                                                        <button
                                                            onClick={() => handleLogoutSession(session.id)}
                                                            className="ml-4 px-3 py-1 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm border border-red-500/50"
                                                        >
                                                            Đăng xuất
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Back Button */}
                <div className="text-center mt-8">
                    <button
                        onClick={() => router.back()}
                        className="inline-flex items-center gap-2 text-gray-500 dark:text-purple-300 hover:text-gray-900 dark:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Quay lại
                    </button>
                </div>
            </div>
        </div>
    );
}








