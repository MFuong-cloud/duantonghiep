"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { login as loginApi } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      emailOrPhoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginBodyType) => {
    setLoading(true);
    setError("");

    try {
      const res = await loginApi(values.emailOrPhoneNumber, values.password);
      console.log("✅ Login success:", res);

      localStorage.setItem("token", res.token);
      alert("Đăng nhập thành công!");
      router.push("/");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <FormField
            control={form.control}
            name="emailOrPhoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email hoặc số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="email@example.com hoặc 09*******"
                    className="h-11"
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
                        {...field}
                      />
                    </FormControl>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Mật khẩu phải có ít nhất 8 ký tự</p>
                  </TooltipContent>
                </Tooltip>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 mt-6 font-semibold text-white 
             bg-gradient-to-br from-amber-400 to-orange-500 
             rounded-lg shadow-md transition-all duration-300 
             hover:scale-101 hover:shadow-lg hover:from-amber-500 hover:to-orange-600"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Chưa có tài khoản?
        <Link href="/register" className="font-medium text-primary hover:underline">
          <span> Đăng ký </span>
        </Link>
        để nhận được nhiều ưu đãi
      </p>
    </div>
  );
}
