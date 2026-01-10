<x-mail::message>
# Thanh toán thành công

Xin chào **{{ $customerName }}**,

Thanh toán của bạn đã được xử lý thành công! Cảm ơn bạn đã sử dụng dịch vụ của **TableGo**.

## Thông tin thanh toán

<x-mail::panel>
**Mã đơn:** {{ $order->code ?? $order->id }}  
**Ngày đặt:** {{ $bookingDate }}  
**Giờ đặt:** {{ $bookingTime }}  
**Số người:** {{ $quantity }} người  
**Bàn:** {{ $tableName }}  
**Phương thức thanh toán:** {{ $paymentMethod }}  
**Thời gian thanh toán:** {{ $paidAt }}
</x-mail::panel>

## Chi tiết đơn hàng

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
Không có món ăn nào.
</x-mail::panel>
@endif

## Tổng đã thanh toán

<x-mail::panel>
**{{ $totalPrice }} VNĐ**
</x-mail::panel>

<x-mail::button :url="env('FRONTEND_URL', 'http://localhost:3000') . '/history'">
Xem lịch sử đơn hàng
</x-mail::button>

Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi!

Trân trọng,<br>
{{ config('app.name') }}
</x-mail::message>
