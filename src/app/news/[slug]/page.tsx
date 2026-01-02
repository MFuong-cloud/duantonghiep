"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { NewsService } from "@/api/news/news.service";
import { News, Comment } from "@/model/News";
import Image from "next/image";
import { toast } from "react-toastify";

export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [commentContent, setCommentContent] = useState("");
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (slug) {
            fetchNewsDetail();
        }
    }, [slug]);

    const fetchNewsDetail = async () => {
        try {
            setLoading(true);
            const data = await NewsService.getNewsBySlug(slug);
            setNews(data);
        } catch (error) {
            console.error("Error fetching news detail:", error);
            toast.error("Không thể tải tin tức");
            router.push("/news");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!commentContent.trim()) {
            toast.warning("Vui lòng nhập nội dung bình luận");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            toast.error("Vui lòng đăng nhập để bình luận");
            router.push("/auth/login");
            return;
        }

        try {
            setSubmitting(true);
            await NewsService.createComment({
                news_id: news!.id,
                content: commentContent,
                parent_id: replyTo,
            });

            toast.success("Bình luận của bạn đang chờ duyệt");
            setCommentContent("");
            setReplyTo(null);
            // Reload news to get updated comments
            await fetchNewsDetail();
        } catch (error) {
            console.error("Error submitting comment:", error);
            toast.error("Không thể gửi bình luận");
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("vi-VN", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getImageUrl = (imagePath: string | null) => {
        if (!imagePath) return "/images/news-placeholder.jpg";
        if (imagePath.startsWith("http")) return imagePath;
        return `http://127.0.0.1:8000/storage/${imagePath}`;
    };

    const renderComment = (comment: Comment, isReply: boolean = false) => (
        <div
            key={comment.id}
            className={`${isReply ? "ml-12 mt-4" : "mt-6"} bg-white rounded-xl p-4 shadow-sm`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold">
                    {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="flex-1">
                    {/* User info */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800">
                            {comment.user?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500">
                            {formatDate(comment.created_at)}
                        </span>
                    </div>

                    {/* Comment content */}
                    <p className="text-gray-700 mb-2">{comment.content}</p>

                    {/* Reply button */}
                    {!isReply && (
                        <button
                            onClick={() => setReplyTo(comment.id)}
                            className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                        >
                            💬 Trả lời
                        </button>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4">
                            {comment.replies.map((reply) => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!news) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-12">
                <div className="container mx-auto px-4">
                    <button
                        onClick={() => router.push("/news")}
                        className="mb-4 text-orange-100 hover:text-white flex items-center gap-2 transition-colors"
                    >
                        ← Quay lại danh sách tin tức
                    </button>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{news.title}</h1>
                    <div className="flex items-center gap-4 text-orange-100">
                        <span>📅 {formatDate(news.created_at)}</span>
                        <span>👁️ {news.views} lượt xem</span>
                        {news.category && (
                            <span className="bg-white/20 px-3 py-1 rounded-full text-sm">
                                {news.category.name}
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Featured Image */}
                    {news.image && (
                        <div className="relative h-96 rounded-2xl overflow-hidden mb-8 shadow-2xl">
                            <Image
                                src={getImageUrl(news.image)}
                                alt={news.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                    )}

                    {/* Article Content */}
                    <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white rounded-2xl shadow-lg p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">
                            💬 Bình luận ({news.comments?.length || 0})
                        </h2>

                        {/* Comment Form */}
                        <form onSubmit={handleSubmitComment} className="mb-8">
                            {replyTo && (
                                <div className="mb-3 flex items-center gap-2">
                                    <span className="text-sm text-gray-600">
                                        Đang trả lời bình luận
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setReplyTo(null)}
                                        className="text-sm text-red-600 hover:text-red-700"
                                    >
                                        ✕ Hủy
                                    </button>
                                </div>
                            )}
                            <textarea
                                value={commentContent}
                                onChange={(e) => setCommentContent(e.target.value)}
                                placeholder="Viết bình luận của bạn..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                rows={4}
                            />
                            <button
                                type="submit"
                                disabled={submitting}
                                className="mt-3 px-6 py-3 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                            >
                                {submitting ? "Đang gửi..." : "Gửi bình luận"}
                            </button>
                        </form>

                        {/* Comments List */}
                        <div>
                            {news.comments && news.comments.length > 0 ? (
                                news.comments.map((comment) => renderComment(comment))
                            ) : (
                                <div className="text-center py-12 text-gray-500">
                                    <div className="text-4xl mb-2">💬</div>
                                    <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
