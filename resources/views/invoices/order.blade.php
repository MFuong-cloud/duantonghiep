<!DOCTYPE html>
<html lang="vi">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Hóa đơn {{ $order->code }}</title>
    <style>
        body {
            font-family: 'DejaVu Sans', 'Arial', sans-serif;
            font-size: 13px;
            margin: 20px;
        }
        .header {
            text-align: center;
            margin-bottom: 20px;
            border-bottom: 2px solid #000;
            padding-bottom: 10px;
        }
        .header h1 {
            margin: 0 0 5px 0;
            font-size: 24px;
        }
        .header p {
            margin: 3px 0;
            font-size: 11px;
        }
        .title {
            text-align: center;
            font-size: 20px;
            font-weight: bold;
            margin: 15px 0;
        }
        .info {
            margin: 15px 0;
        }
        .info-row {
            margin: 5px 0;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }
        th, td {
            border: 1px solid #000;
            padding: 8px;
            text-align: left;
        }
        th {
            background-color: #ddd;
            font-weight: bold;
        }
        .text-right {
            text-align: right;
        }
        .text-center {
            text-align: center;
        }
        .total {
            margin-top: 20px;
            text-align: right;
            font-size: 16px;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 11px;
            border-top: 1px solid #000;
            padding-top: 10px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>NHÀ HÀNG TABLEGO</h1>
        <p>Địa chỉ: B2-R2-13, Khu đô thị Royal City, Hà Nội</p>
        <p>Điện thoại: 0325374481 | Email: contact@tablego.vn</p>
    </div>

    <div class="title">HÓA ĐƠN THANH TOÁN</div>

    <div class="info">
        <div class="info-row"><strong>Mã đơn hàng:</strong> {{ $order->code }}</div>
        <div class="info-row"><strong>Khách hàng:</strong> {{ $order->ho_ten }}</div>
        <div class="info-row"><strong>Số điện thoại:</strong> {{ $order->phone }}</div>
        <div class="info-row"><strong>Số người:</strong> {{ $order->quantity }} người</div>
        @if($order->table)
        <div class="info-row"><strong>Bàn:</strong> {{ $order->table->name }}</div>
        @endif
        <div class="info-row"><strong>Ngày đặt:</strong> {{ \Carbon\Carbon::parse($order->booking_date)->format('d/m/Y') }}</div>
        <div class="info-row"><strong>Giờ:</strong> {{ $order->booking_time }}</div>
    </div>

    <table>
        <thead>
            <tr>
                <th width="5%">STT</th>
                <th width="45%">Tên món</th>
                <th width="15%" class="text-center">Số lượng</th>
                <th width="17%" class="text-right">Đơn giá</th>
                <th width="18%" class="text-right">Thành tiền</th>
            </tr>
        </thead>
        <tbody>
            @forelse($order->details as $index => $detail)
            <tr>
                <td class="text-center">{{ $index + 1 }}</td>
                <td>{{ optional($detail->dish)->name ?? 'Món ăn đã xóa' }}</td>
                <td class="text-center">{{ $detail->quantity }}</td>
                <td class="text-right">{{ number_format($detail->price, 0, ',', '.') }}đ</td>
                <td class="text-right">{{ number_format($detail->price * $detail->quantity, 0, ',', '.') }}đ</td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="text-center">Chưa có món ăn nào</td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="total">
        TỔNG CỘNG: {{ number_format($order->total_price, 0, ',', '.') }}đ
    </div>

    <div class="info">
        <div class="info-row"><strong>Phương thức thanh toán:</strong> 
            @if($paymentMethod == 'cash') Tiền mặt
            @elseif($paymentMethod == 'momo') MoMo
            @else Chưa thanh toán
            @endif
        </div>
        @if($order->note)
        <div class="info-row"><strong>Ghi chú:</strong> {{ $order->note }}</div>
        @endif
    </div>

    <div class="footer">
        <p><strong>Cảm ơn quý khách đã sử dụng dịch vụ!</strong></p>
        <p>Hóa đơn được tạo tự động bởi hệ thống TableGo</p>
    </div>
</body>
</html>
