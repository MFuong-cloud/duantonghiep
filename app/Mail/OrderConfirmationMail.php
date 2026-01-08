<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderConfirmationMail extends Mailable
{
    use Queueable, SerializesModels;

    public $order;

    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Xác nhận đặt chỗ thành công - TableGo',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.order-confirmation',
            with: [
                'order' => $this->order,
                'customerName' => $this->order->ho_ten,
                'bookingDate' => \Carbon\Carbon::parse($this->order->booking_date)->format('d/m/Y'),
                'bookingTime' => $this->order->booking_time,
                'quantity' => $this->order->quantity,
                'totalPrice' => number_format($this->order->total_price, 0, ',', '.'),
                'tableName' => $this->order->table ? $this->order->table->name : 'Chưa chọn',
                'items' => $this->order->details,
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
