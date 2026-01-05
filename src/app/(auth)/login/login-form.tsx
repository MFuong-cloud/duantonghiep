"use client";

import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import { LoginBody, LoginBodyType } from "@/schema/auth/login.schema";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthService } from "@/api/auth/auth.service";
import { useAuth } from "@/api/auth/AuthContext";
import { CheckCircle2, Loader2 } from "lucide-react";
import { extractRoleFromPayload, persistRoleFromPayload, roleHasAdminAccess } from "@/lib/auth";

type DialogStatus = "processing" | "success";

export default function LoginForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { resetState } = useAuth();
    const [dialogState, setDialogState] = useState<{
        open: boolean;
        status: DialogStatus;
        title: string;
        description: string;
    }>({
        open: false,
        status: "processing",
        title: "",
        description: "",
    });
    const [shouldRedirectAfterDialog, setShouldRedirectAfterDialog] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingRedirect, setPendingRedirect] = useState<string | null>(null);

    const adminRequired = useMemo(() => searchParams?.get("admin") === "1", [searchParams]);

    const redirectParam = useMemo(() => {
        const redirect = searchParams?.get("returnUrl");
        if (redirect && redirect.startsWith("/")) {
            return redirect;
        }
        return null;
    }, [searchParams]);

    useEffect(() => {
        if (!dialogState.open && shouldRedirectAfterDialog) {
            setShouldRedirectAfterDialog(false);
            router.push(pendingRedirect ?? "/");
            setPendingRedirect(null);
        }
    }, [dialogState.open, shouldRedirectAfterDialog, router, pendingRedirect]);

    useEffect(() => {
        let timer: ReturnType<typeof setTimeout> | undefined;
        if (dialogState.open && dialogState.status === "success") {
            timer = setTimeout(() => {
                setDialogState((prev) => ({ ...prev, open: false }));
            }, 2000);
        }
        return () => {
            if (timer) clearTimeout(timer);
        };
    }, [dialogState.open, dialogState.status]);

    const handleDialogChange = (open: boolean) => {
        if (!open && dialogState.status === "processing") {
            return;
        }
        setDialogState((prev) => ({ ...prev, open }));
    };

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            emailOrPhoneNumber: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginBodyType) {
        setIsSubmitting(true);
        setDialogState({
            open: true,
            status: "processing",
            title: adminRequired ? "Đang xác thực quyền quản trị" : "Đang thực hiện đăng nhập",
            description: adminRequired
                ? "Vui lòng chờ trong giây lát, chúng tôi đang kiểm tra quyền admin của bạn..."
                : "Vui lòng chờ trong giây lát...",
        });

        console.log("Login attempt with:", values.emailOrPhoneNumber);
        try {
            const result = await AuthService.login(values.emailOrPhoneNumber, values.password);

            if (result.ok) {
                const token = result.payload.data?.token || result.payload.token;

                if (token) {
                    localStorage.setItem("authToken", token);
                }

                const userData = result.payload.data?.user || result.payload.user;
                if (userData) {
                    const userInfo = {
                        id: userData.id,
                        name: userData.name,
                        email: userData.email,
                        phone: userData.phone,
                        role: userData.role,
                    };
                    localStorage.setItem("userInfo", JSON.stringify(userInfo));
                }

                persistRoleFromPayload(result.payload);
                const roleFromPayload = extractRoleFromPayload(result.payload);
                resetState();
                setDialogState({
                    open: true,
                    status: "success",
                    title: adminRequired ? "Đăng nhập quyền admin thành công" : "Đăng nhập thành công",
                    description:
                        result.payload.message ||
                        (adminRequired
                            ? "Bạn đã đăng nhập bằng tài khoản quản trị. Bấm tiếp tục để truy cập khu vực admin."
                            : "Bạn đã đăng nhập thành công. Bấm tiếp tục để khám phá trang chủ."),
                });
                setShouldRedirectAfterDialog(true);
                const fallbackRedirect =
                    redirectParam ??
                    (roleHasAdminAccess(roleFromPayload) ? "/admin" : "/");
                setPendingRedirect(fallbackRedirect);
            } else {
                console.error("Login failed:", result.status, result.payload);
                const errorMessage = result.payload?.message ||
                    (result.status === 401 ? "Sai tài khoản hoặc mật khẩu!" :
                        "Đăng nhập thất bại! Vui lòng thử lại.");
                toast.error(errorMessage);
                setDialogState((prev) => ({ ...prev, open: false }));
            }
        } catch (error) {
            console.error("Login error:", error);
            toast.error("Đăng nhập thất bại! Vui lòng thử lại.");
            setDialogState((prev) => ({ ...prev, open: false }));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            {adminRequired && (
                <div className="mb-6 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                    <p className="font-medium">Trang quản trị yêu cầu tài khoản có quyền Admin.</p>
                </div>
            )}
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="emailOrPhoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email hoặc số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="email@example.com hoặc 09xxxxxxx"
                                        className="h-11"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="h-11"
                                                disabled={isSubmitting}
                                                {...field}
                                            />
                                        </FormControl>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>
                                            Mật khẩu phải có ít nhất 8 ký tự, bao gồm số, chữ và 1 ký
                                            tự đặc biệt
                                        </p>
                                    </TooltipContent>
                                </Tooltip>

                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="flex justify-end">
                        <Link
                            href="/forgot-password"
                            className="text-sm font-medium text-primary hover:underline"
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <Button type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 mt-6 font-semibold text-white
                             bg-gradient-to-br from-amber-400 to-orange-500
                             rounded-lg shadow-md transition-all duration-300
                             hover:scale-101 hover:shadow-lg hover:from-amber-500 hover:to-orange-600">
                        Đăng nhập
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground mt-6">
                Chưa có tài khoản?
                <Link
                    href="/register"
                    className="font-medium text-primary hover:underline"
                >
                    <span> Đăng ký </span>
                </Link>
                để nhận được nhiều ưu đãi{" "}
            </p>

            <Dialog open={dialogState.open} onOpenChange={handleDialogChange}>
                <DialogContent showCloseButton={dialogState.status === "success"}>
                    <DialogHeader>
                        <div className="flex flex-col items-center gap-4 text-center">
                            {dialogState.status === "processing" ? (
                                <Loader2 className="h-12 w-12 animate-spin text-orange-500" />
                            ) : (
                                <CheckCircle2 className="h-12 w-12 text-green-500" />
                            )}
                            <DialogTitle>{dialogState.title}</DialogTitle>
                            <DialogDescription>
                                {dialogState.description}
                            </DialogDescription>
                        </div>
                    </DialogHeader>
                    {dialogState.status === "success" ? (
                        <DialogFooter>
                            <Button
                                className="w-full"
                                onClick={() => setDialogState((prev) => ({ ...prev, open: false }))}
                            >
                                Tiếp tục
                            </Button>
                        </DialogFooter>
                    ) : (
                        <DialogFooter>
                            <Button className="w-full" disabled>
                                Đang xử lý...
                            </Button>
                        </DialogFooter>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}

