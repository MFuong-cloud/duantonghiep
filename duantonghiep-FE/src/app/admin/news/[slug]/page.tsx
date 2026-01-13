"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { NewsService } from "@/api/news/news.service";
import { News, Comment } from "@/model/News";
import Image from "next/image";
import { toast } from "sonner";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Smile } from "lucide-react";
import { getImageUrl, getNewsPlaceholder } from "@/lib/utils/image";
import { formatDateVN } from "@/lib/utils/format";


interface CommentInputProps {
    onSubmit: (content: string) => Promise<void>;
    isSubmitting: boolean;
    placeholder?: string;
    autoFocus?: boolean;
    onCancel?: () => void;
    submitLabel?: string;
}

const CommentInput = ({
    onSubmit,
    isSubmitting,
    placeholder = "Viết bình luận của bạn...",
    autoFocus = false,
    onCancel,
    submitLabel = "Gửi bình luận",
}: CommentInputProps) => {
    const [content, setContent] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) {
            toast.warning("Vui lòng nhập nội dung bình luận");
            return;
        }
        await onSubmit(content);
        setContent("");
    };

    return (
        <form onSubmit={handleSubmit} className="mb-4">
            <div className="relative">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                    className="w-full px-4 py-3 border border-gray-200 dark:border-neutral-700 bg-gray-50 dark:bg-[#111] text-gray-900 dark:text-gray-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-colors placeholder:text-gray-400 dark:placeholder:text-gray-500 pr-12 text-sm md:text-base"
                    rows={3}
                />
                <div className="absolute bottom-3 right-3">
                    <Popover>
                        <PopoverTrigger asChild>
                            <button
                                type="button"
                                className="p-2 text-gray-400 hover:text-orange-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-neutral-800"
                                title="Chèn biểu tượng cảm xúc"
                            >
                                <Smile className="w-5 h-5 md:w-6 md:h-6" />
                            </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 p-0 border-none shadow-xl rounded-xl overflow-hidden" align="end">
                            <div className="bg-gray-100 dark:bg-neutral-800 p-2 border-b border-gray-200 dark:border-neutral-700">
                                <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Biểu tượng cảm xúc</p>
                            </div>
                            <div className="h-64 overflow-y-auto p-2 grid grid-cols-7 gap-1 bg-white dark:bg-neutral-900 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-neutral-700">
                                {[
                                    "😀", "😃", "😄", "😁", "😆", "😅", "😂",
                                    "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌",
                                    "😍", "🥰", "😘", "😗", "😙", "😚", "😋",
                                    "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓",
                                    "😎", "🤩", "🥳", "😏", "😒", "😞", "😔",
                                    "😟", "😕", "🙁", "☹️", "😣", "😖", "😫",
                                    "😩", "🥺", "😢", "😭", "😤", "😠", "😡",
                                    "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨",
                                    "😰", "😥", "😓", "🤗", "🤔", "🤭", "🤫",
                                    "🤥", "😶", "😐", "😑", "😬", "🙄", "😯",
                                    "😦", "😧", "😮", "😲", "🥱", "😴", "🤤",
                                    "😪", "😵", "🤐", "🥴", "🤢", "🤮", "🤧",
                                    "😷", "🤒", "🤕", "🤑", "🤠", "😈", "👿",
                                    "👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘",
                                    "🤙", "🖐", "✋", "👋", "👏", "🙏", "❤️",
                                    "🧡", "💛", "💚", "💙", "💜", "🖤", "💔",
                                    "❣️", "💕", "💞", "💓", "💗", "💖", "💘",
                                    "🎉", "✨", "🔥", "💯", "🎁", "🎂", "🎈"
                                ].map((emoji, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => setContent((prev) => prev + emoji)}
                                        className="h-9 w-9 flex items-center justify-center text-xl hover:bg-gray-100 dark:hover:bg-neutral-800 rounded-lg transition-colors"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            <div className="flex justify-end gap-3 mt-3">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                        Hủy
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-700 dark:to-red-700 text-white rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50 text-sm"
                >
                    {isSubmitting ? "Đang gửi..." : submitLabel}
                </button>
            </div>
        </form>
    );
};

// --- Main Page Component ---
export default function NewsDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchNewsDetail = useCallback(async () => {
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
    }, [slug, router]);

    useEffect(() => {
        if (slug) {
            fetchNewsDetail();
        }
    }, [slug, fetchNewsDetail]);

    const handleCommentSubmit = async (content: string, parentId?: number) => {
        const token = localStorage.getItem("authToken"); // Corrected Key
        if (!token) {
            toast.error("Vui lòng đăng nhập để bình luận");
            router.push("/auth/login");
            return;
        }

        try {
            setSubmitting(true);
            await NewsService.createComment({
                news_id: news!.id,
                content: content,
                parent_id: parentId || null, // null if undefined
            });

            toast.success("Bình luận của bạn đang chờ duyệt");
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



    const renderComment = (comment: Comment, isReply: boolean = false) => (
        <div
            key={comment.id}
            className={`${isReply ? "ml-12 mt-4" : "mt-6"} bg-gray-50 dark:bg-neutral-700/50 rounded-xl p-4 shadow-sm`}
        >
            <div className="flex items-start gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold shrink-0">
                    {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>

                <div className="flex-1">
                    {/* User info */}
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-semibold text-gray-800 dark:text-gray-200">
                            {comment.user?.name || "Anonymous"}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDateVN(comment.created_at)}
                        </span>
                    </div>

                    {/* Comment content */}
                    <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">{comment.content}</p>

                    {/* Reply button */}
                    {!isReply && (
                        <button
                            onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
                            className="text-sm text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 font-medium"
                        >
                            💬 Trả lời
                        </button>
                    )}

                    {/* Inline Reply Form */}
                    {replyTo === comment.id && !isReply && (
                        <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-200">
                            <CommentInput
                                onSubmit={(content) => handleCommentSubmit(content, comment.id)}
                                isSubmitting={submitting}
                                placeholder={`Trả lời ${comment.user?.name}...`}
                                autoFocus={true}
                                onCancel={() => setReplyTo(null)}
                                submitLabel="Trả lời"
                            />
                        </div>
                    )}

                    {/* Replies */}
                    {comment.replies && comment.replies.length > 0 && (
                        <div className="mt-4 border-l-2 border-gray-200 dark:border-neutral-600 pl-4">
                            {comment.replies.map((reply) => renderComment(reply, true))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-neutral-950">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (!news) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-slate-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 transition-colors duration-300">
            {/* Header with Background Image */}
            <div className="relative w-full h-[65vh] md:h-[85vh] min-h-[500px] bg-gray-900 flex flex-col justify-end pb-12 md:pb-20 group rounded-b-[3rem] overflow-hidden shadow-2xl">
                {news.image ? (
                    <>
                        <Image
                            src={getImageUrl(news.image, getNewsPlaceholder())}
                            alt={news.title}
                            fill
                            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-[2s]"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                    </>
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-600 to-red-600 dark:from-orange-900 dark:to-red-950" />
                )}

                <div className="container mx-auto px-4 relative z-10">
                    <button
                        onClick={() => router.push("/news")}
                        className="mb-8 px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 flex items-center gap-2 transition-all w-fit font-medium"
                    >
                        ← Quay lại danh sách tin tức
                    </button>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-8 text-white leading-tight drop-shadow-2xl">
                        {news.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-4 md:gap-6 text-gray-100 text-base md:text-lg font-medium">
                        <span className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                            <span>📅</span>
                            {formatDateVN(news.created_at)}
                        </span>
                        <span className="flex items-center gap-2.5 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 shadow-lg">
                            <span>👁️</span>
                            {news.views} lượt xem
                        </span>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto">
                    {/* Article Content */}
                    <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-lg p-8 md:p-14 mb-8 text-gray-800 dark:text-gray-200 transition-colors duration-300 ring-1 ring-gray-100 dark:ring-neutral-800">
                        <div
                            className="prose prose-lg max-w-none dark:prose-invert prose-img:rounded-xl prose-a:text-orange-600 dark:prose-a:text-orange-400"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />
                    </div>

                    {/* Comments Section */}
                    <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-lg p-8 transition-colors duration-300">
                        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-6 border-b border-gray-100 dark:border-neutral-800 pb-4">
                            💬 Bình luận ({news.comments?.length || 0})
                        </h2>

                        {/* Main Comment Form */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-4">Để lại bình luận</h3>
                            <CommentInput
                                onSubmit={(content) => handleCommentSubmit(content)}
                                isSubmitting={submitting}
                            />
                        </div>

                        {/* Comments List */}
                        <div className="space-y-6">
                            {news.comments && news.comments.length > 0 ? (
                                news.comments.map((comment) => renderComment(comment))
                            ) : (
                                <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-neutral-800/50 rounded-xl">
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
