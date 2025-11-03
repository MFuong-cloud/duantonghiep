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
import {
  RegisterBody,
  RegisterBodyType,
} from "@/schemaValidations/auth.schema";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthService } from "./_services/services";

export default function RegisterForm() {
  const router = useRouter(); // ✅ hook được gọi trong component
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
    try {
      const result = await AuthService.register(
        values.name,
        values.email,
        values.phoneNumber,
        values.password,
        values.confirmPassword
      );

      if (result.ok) {
        toast.success("Đăng ký thành công!");
        router.push("/login");
      } else {
        toast.error(result.payload.message || "Đăng ký thất bại!");
      }
    } catch (error) {
      toast.error("Lỗi hệ thống. Vui lòng thử lại!");
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
                <FormLabel>Email</FormLabel>
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
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Số điện thoại</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="09*******"
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
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full h-11 mt-6 font-semibold text-white bg-gradient-to-br
              from-amber-400 to-orange-500 rounded-lg shadow-md transition-all
              duration-300 hover:scale-101 hover:shadow-lg hover:from-amber-500 hover:to-orange-600"
          >
            Đăng ký
          </Button>
        </form>
      </Form>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-primary hover:underline">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
