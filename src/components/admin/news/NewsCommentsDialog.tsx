"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Comment, News } from "@/model/News";
import { AdminCommentService } from "@/api/news/news.service";
import { toast } from "sonner";
import { Loader2, MessageCircle, Check, Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { vi } from "date-fns/locale";

interface NewsCommentsDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    news: News | null;
}

export default function NewsCommentsDialog({
    open,
    onOpenChange,
    news,
}: NewsCommentsDialogProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);

    const loadComments = useCallback(async () => {
        if (!news) return;
        try {
            setLoading(true);
            const data = await AdminCommentService.getByNewsId(news.id);
            let commentsList: Comment[] = [];
            if (Array.isArray(data)) {
                commentsList = data;
            } else if (data.data && Array.isArray(data.data)) {
                commentsList = data.data;
            }

            const relevantComments = commentsList.filter(c => c.news_id === news.id);
            relevantComments.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

            setComments(relevantComments);
        } catch (error) {
            console.error(error);
            toast.error("Không thể tải bình luận");
        } finally {
            setLoading(false);
        }
    }, [news]);

    useEffect(() => {
        if (open && news) {
            loadComments();
        }
    }, [open, news, loadComments]);

    const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null);

    const handleApprove = async (id: number) => {
        try {
            await AdminCommentService.approve(id);
            setComments(prev => prev.map(c => c.id === id ? { ...c, is_active: true } : c));
            toast.success("Đã duyệt bình luận");
        } catch (error) {
            console.error(error);
            toast.error("Không thể duyệt bình luận");
        }
    };

    const confirmDelete = async () => {
        if (!deletingCommentId) return;
        try {
            await AdminCommentService.delete(deletingCommentId);
            setComments(prev => prev.filter(c => c.id !== deletingCommentId));
            toast.success("Đã xóa bình luận");
            setDeletingCommentId(null);
        } catch (error) {
            console.error(error);
            toast.error("Không thể xóa bình luận");
        }
    };

    const formatDate = (dateString: string) => {
        try {
            return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: vi });
        } catch {
            return dateString;
        }
    };

    return (
        <>
            <Dialog open={open} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-2xl h-[80vh] flex flex-col bg-white dark:bg-[#1f1f1f]">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold">
                            <MessageCircle className="w-5 h-5 text-blue-500" />
                            Bình luận: {news?.title}
                        </DialogTitle>
                    </DialogHeader>

                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center h-full text-gray-400">
                                <Loader2 className="w-8 h-8 animate-spin mr-2" />
                                Đang tải...
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                <MessageCircle className="w-12 h-12 opacity-20 mb-2" />
                                <p>Chưa có bình luận nào</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {comments.map((comment) => (
                                    <div key={comment.id} className={`p-4 rounded-xl border ${comment.is_active ? "border-gray-100 dark:border-gray-800 bg-white dark:bg-[#252525]" : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10 dark:border-yellow-900/30"}`}>
                                        <div className="flex justify-between items-start gap-3">
                                            <div className="flex gap-3 w-full">
                                                <Avatar className="w-10 h-10 border border-gray-200 dark:border-gray-700">
                                                    <AvatarImage src={comment.user?.avatar} />
                                                    <AvatarFallback>{comment.user?.name?.charAt(0) || "U"}</AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1">
                                                    <div className="flex items-center justify-between mb-1">
                                                        <div>
                                                            <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">{comment.user?.name || "Người dùng ẩn danh"}</span>
                                                            <span className="mx-2 text-gray-300">•</span>
                                                            <span className="text-xs text-gray-500">{formatDate(comment.created_at)}</span>
                                                        </div>
                                                        {!comment.is_active && (
                                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-400 text-[10px] rounded-full font-medium">Chờ duyệt</span>
                                                        )}
                                                    </div>
                                                    <p className="text-gray-700 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">{comment.content}</p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 shrink-0">
                                                {!comment.is_active && (
                                                    <Button size="icon" variant="ghost" className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50 dark:hover:bg-green-900/20" onClick={() => handleApprove(comment.id)} title="Duyệt">
                                                        <Check className="w-4 h-4" />
                                                    </Button>
                                                )}
                                                <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20" onClick={() => setDeletingCommentId(comment.id)} title="Xóa">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <DialogFooter className="border-t pt-4 border-gray-100 dark:border-gray-800">
                        <Button variant="outline" onClick={() => onOpenChange(false)}>Đóng</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={!!deletingCommentId} onOpenChange={(open) => !open && setDeletingCommentId(null)}>
                <DialogContent className="bg-white dark:bg-[#1f1f1f] text-gray-800 dark:text-gray-100 rounded-lg max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 text-lg">Xóa bình luận?</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        Bạn có chắc chắn muốn xóa bình luận này không? Hành động này không thể hoàn tác.
                    </p>
                    <DialogFooter className="flex justify-end gap-2 mt-4">
                        <Button variant="outline" size="sm" onClick={() => setDeletingCommentId(null)}>
                            Hủy
                        </Button>
                        <Button variant="destructive" size="sm" onClick={confirmDelete}>
                            Xóa
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
