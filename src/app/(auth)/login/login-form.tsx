"use client";

import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";

import {Button} from "@/components/ui/button";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage,} from "@/components/ui/form";
import {Input} from "@/components/ui/input";
import {LoginBody, LoginBodyType} from "@/schema/auth/login.schema";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {toast} from "sonner";
import { useRouter } from "next/navigation";
import {AuthService} from "@/api/auth/auth.service";
import {useAuth} from "@/api/auth/AuthContext";

export default function LoginForm() {
    const router = useRouter()
    const { resetState } = useAuth();

    const form = useForm<LoginBodyType>({
        resolver: zodResolver(LoginBody),
        defaultValues: {
            emailOrPhoneNumber: "",
            password: "",
        },
    });

    async function onSubmit(values: LoginBodyType) {
        const result = await AuthService.login(values.emailOrPhoneNumber, values.password);

        if (result.ok) {
            // Lưu token xuống localStorage (hỗ trợ cả 2 format: payload.token hoặc payload.data.token)
            const token = result.payload.data?.token || result.payload.token;
            if (token) {
                localStorage.setItem("authToken", token);
            }

            // Toast log
            toast.success(result.payload.message || "Đăng nhập thành công!");

            // Điều hướng về trang home
            resetState();
            router.push("/");

        } else {
            toast.error(result.payload.message || "Sai tài khoản hoặc mật khẩu!");
        }
    }

    return (
        <div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                        control={form.control}
                        name="emailOrPhoneNumber"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Email hoặc số điện thoại</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="email@example.com hoặc 09xxxxxxx"
                                        className="h-11"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Mật khẩu</FormLabel>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="••••••••"
                                                className="h-11"
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

                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <Button type="submit"
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
        </div>
    );
}
