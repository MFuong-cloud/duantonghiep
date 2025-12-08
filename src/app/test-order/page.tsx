"use client";

import { useState } from "react";
import { toast } from "sonner";
import { OrderService, CreateOrderData } from "@/api/orders/order.service";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderTestPage() {
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<any>(null);

    const testOrderData: CreateOrderData = {
        user_id: 1,
        ho_ten: "Khách Test",
        phone: "0900000000",
        booking_date: "2025-12-10",
        booking_time: 18,
        quantity: 2,
        note: "Test order",
        items: [
            {
                dish_id: 8,
                quantity: 1
            },
            {
                dish_id: 9,
                quantity: 2
            }
        ]
    };

    const handleCreateOrder = async () => {
        setLoading(true);
        setResponse(null);

        try {
            const result = await OrderService.createOrder(testOrderData);
            setResponse(result);
            toast.success("Đặt hàng thành công!");
            console.log("Order created:", result);
        } catch (error: any) {
            console.error("Error creating order:", error);
            toast.error(error?.message || "Có lỗi xảy ra khi đặt hàng");
            setResponse({ error: error?.message || error });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-8">
            <Card className="max-w-3xl mx-auto">
                <CardHeader>
                    <CardTitle className="text-2xl">Test Order API</CardTitle>
                    <CardDescription>
                        Thử nghiệm API tạo đơn hàng với endpoint: POST http://localhost:8000/api/orders
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="font-semibold mb-2">Dữ liệu gửi đi:</h3>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto text-sm">
                            {JSON.stringify(testOrderData, null, 2)}
                        </pre>
                    </div>

                    <Button
                        onClick={handleCreateOrder}
                        disabled={loading}
                        className="w-full bg-[#ff6600] hover:bg-[#ff7a1a]"
                    >
                        {loading ? "Đang gửi..." : "Tạo đơn hàng"}
                    </Button>

                    {response && (
                        <div>
                            <h3 className="font-semibold mb-2">
                                {response.error ? "Lỗi:" : "Kết quả:"}
                            </h3>
                            <pre className={`p-4 rounded-lg overflow-auto text-sm ${response.error
                                    ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-200"
                                    : "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200"
                                }`}>
                                {JSON.stringify(response, null, 2)}
                            </pre>
                        </div>
                    )}

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Hướng dẫn sử dụng:</h3>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                            <li>Đảm bảo backend Laravel đang chạy ở http://localhost:8000</li>
                            <li>Đảm bảo có user với id = 1 trong database</li>
                            <li>Đảm bảo có món ăn với id = 8 và 9 trong database</li>
                            <li>Click nút "Tạo đơn hàng" để test API</li>
                        </ol>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
