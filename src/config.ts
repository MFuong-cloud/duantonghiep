// src/config.ts

const envConfig = {
    NEXT_PUBLIC_API_ENDPOINT: process.env.NEXT_PUBLIC_API_ENDPOINT ?? "",
};

if (!envConfig.NEXT_PUBLIC_API_ENDPOINT) {
    console.warn(
        "⚠ WARNING: NEXT_PUBLIC_API_ENDPOINT không tồn tại! Kiểm tra lại file .env.local"
    );
}

export default envConfig;
