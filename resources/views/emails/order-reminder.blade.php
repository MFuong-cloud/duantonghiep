<x-mail::message>
# Nhắc nhở đặt bàn sắp tới

Xin chào **{{ $customerName }}**,

Chúng tôi muốn nhắc bạn rằng bạn có một lịch đặt bàn sắp tới tại **TableGo** chỉ trong **15 phút nữa**. Chúng tôi rất mong được phục vụ bạn!

## Thông tin chi tiết

<x-mail::panel>
**Thời gian:** {{ $bookingTime }} - {{ $bookingDate }}  
**Bàn:** {{ $tableName }}  
**Mã đơn:** #{{ $order->id }}
</x-mail::panel>

<x-mail::button :url="env('FRONTEND_URL', 'http://localhost:3000') . '/history'">
Xem đơn hàng
</x-mail::button>

Vui lòng đến đúng giờ. Nếu cần thay đổi hoặc hủy, xin hãy thao tác trong phần Lịch sử đơn hàng.

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
