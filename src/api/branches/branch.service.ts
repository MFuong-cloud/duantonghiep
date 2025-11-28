import envConfig from "@/config";

export const BranchService = {
    async getListBranch() {
        try {
            const token = localStorage.getItem("authToken");
            const res = await fetch(`${envConfig.NEXT_PUBLIC_API_ENDPOINT}/branches/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
            });

            const payload = await res.json().catch(() => ({}));

            return {
                ok: res.ok,
                status: res.status,
                payload,
            };
        } catch (error) {
            return {
                ok: false,
                status: 0,
                payload: {message: "Không thể kết nối đến server"},
            };
        }
    },


};
