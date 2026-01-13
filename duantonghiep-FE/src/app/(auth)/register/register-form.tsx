"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { AuthService } from "@/api/auth/auth.service";
import { useAuth } from "@/api/auth/AuthContext";
import { CheckCircle2, Loader2 } from "lucide-react";
import { persistRoleFromPayload } from "@/lib/auth";

// Register schema definition
const RegisterBody = z.object({
    name: z.string().min(1, "Họ và tên không được để trống"),
    email: z.string().email("Email không hợp lệ").optional().or(z.literal("")),
    phoneNumber: z.string().min(10, "Số điện thoại phải có ít nhất 10 số"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    confirmPassword: z.string().min(6, "Xác nhận mật khẩu phải có ít nhất 6 ký tự"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
});

export type RegisterBodyType = z.infer<typeof RegisterBody>;

type DialogStatus = "processing" | "success";

export default function RegisterForm() {
    const router = useRouter();
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

    useEffect(() => {
        if (!dialogState.open && shouldRedirectAfterDialog) {
            setShouldRedirectAfterDialog(false);
            router.push("/");
        }
    }, [dialogState.open, shouldRedirectAfterDialog, router]);

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

    const form = useForm<RegisterBodyType>({
        resolver: zodResolver(RegisterBody),
        defaultValues: {
            name: "",
            email: "",
            phoneNumber: "",
            password: "",
            confirmPassword: "",
        },
    });

    async function onSubmit(values: RegisterBodyType) {
        setIsSubmitting(true);
        setDialogState({
            open: true,
            status: "processing",
            title: "Đang thực hiện đăng ký",
            description: "Vui lòng chờ trong giây lát...",
        });

        try {
            const result = await AuthService.register(values);

            if (result.ok) {
                const token = result.payload.data?.token || result.payload.token;

                if (token) {
                    localStorage.setItem("authToken", token);
                } else {
                    console.warn("No token in response, user will need to login");
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
                resetState();
                setDialogState({
                    open: true,
                    status: "success",
                    title: "Đăng ký thành công",
                    description: result.payload.message || "Tài khoản của bạn đã được tạo. Tiếp tục để khám phá trang chủ.",
                });
                setShouldRedirectAfterDialog(true);
            } else {
                console.error("Register failed:", result.status, result.payload);

                let errorMessage = "Đăng ký thất bại! Vui lòng thử lại.";

                if (result.payload.errors) {
                    const errors = result.payload.errors;
                    const firstError = Object.values(errors)[0];
                    if (Array.isArray(firstError) && firstError.length > 0) {
                        errorMessage = firstError[0];
                    }
                } else if (result.payload.message) {
                    errorMessage = result.payload.message;
                }

                toast.error(errorMessage);
                setDialogState((prev) => ({ ...prev, open: false }));
            }
        } catch (error) {
            console.error("Register error:", error);
            toast.error("Đăng ký thất bại! Vui lòng thử lại.");
            setDialogState((prev) => ({ ...prev, open: false }));
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Họ và tên</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="Nguyễn Văn A"
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
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email <span className="text-muted-foreground text-sm font-normal">(Tùy chọn)</span></FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="email@example.com"
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
                        name="phoneNumber"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="09xxxxxxx"
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

                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Xác nhận mật khẩu</FormLabel>
                                <FormControl>
                                    <Input
                                        type="password"
                                        placeholder="••••••••"
                                        className="h-11"
                                        disabled={isSubmitting}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-11 mt-6 font-semibold text-white bg-gradient-to-br
                            from-amber-400 to-orange-500 rounded-lg shadow-md transition-all
                            duration-300 hover:scale-101 hover:shadow-lg hover:from-amber-500 hover:to-orange-600">
                        Đăng ký
                    </Button>
                </form>
            </Form>

            <p className="text-center text-sm text-muted-foreground mt-6">
                Đã có tài khoản?{" "}
                <Link
                    href="/login"
                    className="font-medium text-primary hover:underline"
                >
                    Đăng nhập
                </Link>
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
