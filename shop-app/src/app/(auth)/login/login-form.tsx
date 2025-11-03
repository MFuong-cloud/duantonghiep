"use client";

import { z } from "zod";
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
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "./_services/services";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: {
      emailOrPhoneNumber: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginBodyType) => {
    console.log("Form gửi đi:", values);
    const result = await AuthService.login(values.emailOrPhoneNumber, values.password);

    if (result.ok) {
      localStorage.setItem("authToken", result.payload.token);
      toast.success("Đăng nhập thành công!");
      router.push("/");
    } else {
      toast.error(result.payload.message || "Sai thông tin đăng nhập!");
    }
  };

  return (
    <div>
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
                    type="email"
                    placeholder="email@example.com"
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
                    <p>Mật khẩu phải có ít nhất 8 ký tự...</p>
                  </TooltipContent>
                </Tooltip>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 mt-6 font-semibold text-white
                             bg-gradient-to-br from-amber-400 to-orange-500
                             rounded-lg shadow-md transition-all duration-300
                             hover:scale-101 hover:shadow-lg hover:from-amber-500 hover:to-orange-600"
          >
            Đăng nhập
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Chưa có tài khoản?
        <Link href="/register" className="font-medium text-primary hover:underline">
          <span> Đăng ký </span>
        </Link>
        để nhận được nhiều ưu đãi{" "}
      </p>
    </div>
  );
}
