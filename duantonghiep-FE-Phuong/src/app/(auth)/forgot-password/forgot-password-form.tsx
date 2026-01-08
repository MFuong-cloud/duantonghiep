"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { AuthService } from "@/api/auth/auth.service";
import { ForgotPasswordBody, ForgotPasswordBodyType, ResetPasswordBody, ResetPasswordBodyType } from "@/schema/auth/forgot-password.schema";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export default function ForgotPasswordForm() {
    const router = useRouter();
    const [step, setStep] = useState<"EMAIL" | "OTP_NEW_PASSWORD">("EMAIL");
    const [headerEmail, setHeaderEmail] = useState("");
    const [identifier, setIdentifier] = useState("");
    const [showEmailInput, setShowEmailInput] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const emailForm = useForm<ForgotPasswordBodyType>({
        resolver: zodResolver(ForgotPasswordBody),
        defaultValues: { email: "", provided_email: "" },
    });

    const resetForm = useForm<ResetPasswordBodyType>({
        resolver: zodResolver(ResetPasswordBody),
        defaultValues: {
            token: "",
            password: "",
            confirmPassword: "",
            phone: "",
        },
    });

    const onSubmitEmail = async (values: ForgotPasswordBodyType) => {
        setIsLoading(true);
        try {
            const res = await AuthService.forgotPassword(values.email, values.provided_email);
            if (res.ok) {
                toast.success(res.payload.message || "Đã gửi mã xác thực!");

                let sentToEmail = values.email;
                if (values.provided_email) {
                    sentToEmail = values.provided_email;
                } else if (!values.email.includes("@")) {
                    sentToEmail = values.email;
                }

                setHeaderEmail(sentToEmail);
                setIdentifier(values.email);
                setStep("OTP_NEW_PASSWORD");
            } else {
                if (res.status === 422 && (res.payload as any)?.require_email) {
                    setShowEmailInput(true);
                    toast.info("Tài khoản chưa có email. Vui lòng nhập email để nhận mã.");
                } else {
                    toast.error(res.payload.message || "Không thể gửi mã xác thực. Vui lòng thử lại.");
                }
            }
        } catch (error) {
            toast.error("Lỗi kết nối.");
        } finally {
            setIsLoading(false);
        }
    };

    const onSubmitReset = async (values: ResetPasswordBodyType) => {
        setIsLoading(true);
        try {
            const isPhone = /^[0-9]+$/.test(identifier);

            const res = await AuthService.resetPassword({
                email: headerEmail,
                token: values.token,
                password: values.password,
                phone: isPhone ? identifier : undefined,
            });

            if (res.ok) {
                toast.success("Mật khẩu đã được thay đổi thành công!");
                router.push("/login");
            } else {
                toast.error(res.payload.message || "Đặt lại mật khẩu thất bại.");
            }
        } catch (error) {
            toast.error("Lỗi kết nối.");
        } finally {
            setIsLoading(false);
        }
    };

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const [otpValues, setOtpValues] = useState<string[]>(Array(6).fill(""));

    useEffect(() => {
        const token = otpValues.join("");
        resetForm.setValue("token", token, { shouldValidate: token.length === 6 });
    }, [otpValues, resetForm]);

    const handleOtpChange = (index: number, value: string) => {
        if (value.length > 1) {
            value = value.slice(-1);
        }

        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otpValues];
        newOtp[index] = value;
        setOtpValues(newOtp);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !otpValues[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").slice(0, 6);
        if (!/^\d+$/.test(pastedData)) return;

        const newOtp = [...otpValues];
        pastedData.split("").forEach((char, i) => {
            if (i < 6) newOtp[i] = char;
        });
        setOtpValues(newOtp);
        inputRefs.current[Math.min(pastedData.length - 1, 5)]?.focus();
    };

    return (
        <Card className="w-full max-w-md shadow-lg border-0 bg-card">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl font-bold text-center text-primary">
                    {step === "EMAIL" ? "Quên mật khẩu" : "Đặt lại mật khẩu"}
                </CardTitle>
                <CardDescription className="text-center">
                    {step === "EMAIL"
                        ? "Nhập Email hoặc Số điện thoại để nhận mã xác thực."
                        : `Nhập mã xác thực đã gửi tới ${headerEmail} và mật khẩu mới.`}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {step === "EMAIL" ? (
                    <Form {...emailForm}>
                        <form onSubmit={emailForm.handleSubmit(onSubmitEmail)} className="space-y-4">
                            <FormField
                                control={emailForm.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email hoặc Số điện thoại</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="SĐT hoặc email@example.com"
                                                {...field}
                                                disabled={isLoading || showEmailInput}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {showEmailInput && (
                                <FormField
                                    control={emailForm.control}
                                    name="provided_email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nhập Email nhận mã</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="email@example.com"
                                                    {...field}
                                                    disabled={isLoading}
                                                    autoFocus
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}

                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : showEmailInput ? (
                                    "Cập nhật Email & Gửi mã"
                                ) : (
                                    "Gửi mã xác thực"
                                )}
                            </Button>
                        </form>
                    </Form>
                ) : (
                    <Form {...resetForm}>
                        <form onSubmit={resetForm.handleSubmit(onSubmitReset)} className="space-y-4">
                            <FormField
                                control={resetForm.control}
                                name="token"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mã xác thực (Token)</FormLabel>
                                        <FormControl>
                                            <div className="flex justify-center gap-2">
                                                {otpValues.map((digit, index) => (
                                                    <Input
                                                        key={index}
                                                        ref={(el) => {
                                                            inputRefs.current[index] = el;
                                                            if (index === 0) {
                                                                field.ref(el);
                                                            }
                                                        }}
                                                        className={cn(
                                                            "w-10 h-10 text-center text-lg font-bold p-0",
                                                            "focus-visible:ring-2 focus-visible:ring-primary"
                                                        )}
                                                        maxLength={1}
                                                        value={digit}
                                                        onChange={(e) => handleOtpChange(index, e.target.value)}
                                                        onKeyDown={(e) => handleKeyDown(index, e)}
                                                        onPaste={handlePaste}
                                                        disabled={isLoading}
                                                        inputMode="numeric"
                                                        autoComplete="one-time-code"
                                                        type="text"
                                                    />
                                                ))}
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={resetForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mật khẩu mới</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={resetForm.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                {...field}
                                                disabled={isLoading}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Đổi mật khẩu"}
                            </Button>

                            <Button
                                type="button"
                                variant="ghost"
                                className="w-full mt-2"
                                onClick={() => {
                                    setStep("EMAIL");
                                    setShowEmailInput(false);
                                    emailForm.reset();
                                }}
                                disabled={isLoading}
                            >
                                Quay lại
                            </Button>
                        </form>
                    </Form>
                )}
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
                <div className="text-sm text-center text-muted-foreground">
                    Nhớ mật khẩu?{" "}
                    <Link href="/login" className="text-primary hover:underline font-medium">
                        Đăng nhập
                    </Link>
                </div>
            </CardFooter>
        </Card>
    );
}
