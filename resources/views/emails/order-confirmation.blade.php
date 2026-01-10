<x-mail::message>
# Xác nhận đặt chỗ thành công

Xin chào **{{ $customerName }}**,

Cảm ơn bạn đã đặt chỗ tại **TableGo**. Đơn đặt chỗ của bạn đã được xác nhận thành công!

## Thông tin đặt chỗ

<x-mail::panel>
**Mã đơn:** {{ $order->code ?? $order->id }}  
**Ngày đặt:** {{ $bookingDate }}  
**Giờ đặt:** {{ $bookingTime }}  
**Số người:** {{ $quantity }} người  
**Bàn:** {{ $tableName }}
</x-mail::panel>

## Món ăn đã chọn

@if($items && count($items) > 0)
<x-mail::table>
| Món ăn | Số lượng | Đơn giá | Thành tiền |
|:-------|:---------|:--------|:-----------|
@foreach($items as $item)
| {{ $item->dish->name ?? 'N/A' }} | {{ $item->quantity }} | {{ number_format($item->price, 0, ',', '.') }}đ | {{ number_format($item->price * $item->quantity, 0, ',', '.') }}đ |
@endforeach
</x-mail::table>
@else
<x-mail::panel>
Chưa có món ăn nào được chọn.
</x-mail::panel>
@endif

## Tổng thanh toán

<x-mail::panel>
**{{ $totalPrice }} VNĐ**
</x-mail::panel>

@if($order->note)
**Ghi chú:** {{ $order->note }}
@endif

<x-mail::button :url="env('FRONTEND_URL', 'http://localhost:3000') . '/history'">
Xem chi tiết đơn hàng
</x-mail::button>

Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
