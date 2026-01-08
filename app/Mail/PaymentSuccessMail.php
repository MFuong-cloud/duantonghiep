<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class PaymentSuccessMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;
    public $paymentMethod;

    public function __construct(Order $order, $paymentMethod = 'Tiền mặt')
    {
        $this->order = $order;
        $this->paymentMethod = $paymentMethod;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Thanh toán thành công - TableGo',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.payment-success',
            with: [
                'order' => $this->order,
                'customerName' => $this->order->ho_ten,
                'bookingDate' => \Carbon\Carbon::parse($this->order->booking_date)->format('d/m/Y'),
                'bookingTime' => $this->order->booking_time,
                'quantity' => $this->order->quantity,
                'totalPrice' => number_format($this->order->total_price, 0, ',', '.'),
                'tableName' => $this->order->table ? $this->order->table->name : 'Chưa chọn',
                'items' => $this->order->details,
                'paymentMethod' => $this->paymentMethod,
                'paidAt' => now()->format('d/m/Y H:i'),
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
