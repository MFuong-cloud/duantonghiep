import { api } from "@/lib/axios";
import { Payment } from "@/model/Payment";

export const PaymentService = {
    getPayments: async (): Promise<Payment[]> => {
        try {
            const response = await api.get<{ data: Payment[] }>("/admin/payments");
            return response.data.data;
        } catch (error) {
            console.error("Error fetching payments:", error);
            throw error;
        }
    },
};
