export const SUCCESS_MESSAGES = {
    LOGIN: 'Đăng nhập thành công!',
    LOGOUT: 'Đăng xuất thành công!',
    REGISTER: 'Đăng ký thành công!',

    DISH: {
        CREATE: 'Thêm món ăn thành công!',
        UPDATE: 'Cập nhật món ăn thành công!',
        DELETE: 'Xóa món ăn thành công!',
        BULK_DELETE: (count: number) => `Đã xóa ${count} món ăn`,
    },

    CATEGORY: {
        CREATE: 'Thêm danh mục thành công!',
        UPDATE: 'Cập nhật danh mục thành công!',
        DELETE: 'Xóa danh mục thành công!',
        BULK_DELETE: (count: number) => `Đã xóa ${count} danh mục`,
    },

    USER: {
        CREATE: 'Thêm người dùng thành công!',
        UPDATE: 'Cập nhật người dùng thành công!',
        DELETE: 'Xóa người dùng thành công!',
        BULK_DELETE: (count: number) => `Đã xóa ${count} người dùng`,
        STATUS_UPDATED: (name: string, status: string) => `Tài khoản "${name}" đã ${status}.`,
    },

    TABLE: {
        CREATE: 'Thêm bàn thành công!',
        UPDATE: 'Cập nhật bàn thành công!',
        DELETE: 'Xóa bàn thành công!',
        BULK_DELETE: (count: number) => `Đã xóa ${count} bàn`,
    },

    INGREDIENT: {
        CREATE: 'Thêm nguyên liệu thành công!',
        UPDATE: 'Cập nhật nguyên liệu thành công!',
        DELETE: 'Xóa nguyên liệu thành công!',
        BULK_DELETE: (count: number) => `Đã xóa ${count} nguyên liệu`,
        STATUS_UPDATED: (name: string, status: string) => `Nguyên liệu "${name}" ${status}.`,
    },

    BOOKING: {
        SUCCESS: '🎉 Đặt bàn thành công! Bạn có thể gọi món sau tại nhà hàng.',
        SUCCESS_WITH_ORDER: '🎉 Đặt bàn & món ăn thành công! Thanh toán sau khi dùng xong bữa.',
    },
} as const;

export const ERROR_MESSAGES = {
    GENERIC: 'Đã có lỗi xảy ra. Vui lòng thử lại!',
    NETWORK: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối!',
    UNAUTHORIZED: 'Bạn không có quyền truy cập!',
    NOT_FOUND: 'Không tìm thấy dữ liệu!',

    LOGIN: 'Đăng nhập thất bại!',
    REGISTER: 'Đăng ký thất bại!',

    DISH: {
        LOAD: 'Không thể tải danh sách món ăn',
        LOAD_DETAIL: 'Không thể tải thông tin món ăn',
        CREATE: 'Không thể thêm món ăn',
        UPDATE: 'Không thể cập nhật món ăn',
        DELETE: 'Không thể xóa món ăn',
        BULK_DELETE: 'Không thể xóa món ăn',
    },

    CATEGORY: {
        LOAD: 'Không thể tải danh sách danh mục',
        CREATE: 'Không thể thêm danh mục',
        UPDATE: 'Không thể cập nhật danh mục',
        DELETE: 'Không thể xóa danh mục',
        BULK_DELETE: 'Không thể xóa danh mục',
        STATUS_UPDATE: 'Không thể cập nhật trạng thái',
    },

    USER: {
        LOAD: 'Không thể tải danh sách người dùng',
        CREATE: 'Không thể thêm người dùng',
        UPDATE: 'Không thể cập nhật người dùng',
        DELETE: 'Không thể xóa người dùng',
        BULK_DELETE: 'Không thể xóa người dùng',
        STATUS_UPDATE: 'Không thể cập nhật trạng thái',
    },

    TABLE: {
        LOAD: 'Không thể tải danh sách bàn',
        CREATE: 'Không thể thêm bàn',
        UPDATE: 'Không thể cập nhật bàn',
        DELETE: 'Không thể xóa bàn',
        DELETE_OCCUPIED: 'Không thể xóa bàn đang được sử dụng!',
        BULK_DELETE: 'Không thể xóa bàn',
        BULK_DELETE_OCCUPIED: (count: number) => `Không thể xóa ${count} bàn đang được sử dụng!`,
    },

    INGREDIENT: {
        LOAD: 'Không thể tải danh sách nguyên liệu',
        CREATE: 'Không thể thêm nguyên liệu',
        UPDATE: 'Không thể cập nhật nguyên liệu',
        DELETE: 'Không thể xóa nguyên liệu',
        BULK_DELETE: 'Không thể xóa nguyên liệu',
        STATUS_UPDATE: 'Không thể cập nhật trạng thái',
    },

    IMAGE: {
        INVALID_TYPE: 'Chỉ chấp nhận file ảnh (JPG, PNG, GIF, WEBP)',
        TOO_LARGE: 'Kích thước ảnh không được vượt quá 2MB',
        UPLOAD_FAILED: 'Upload ảnh thất bại',
    },
} as const;
