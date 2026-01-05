<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use App\Models\Order;

class OrderReminderMail extends Mailable
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
            subject: 'Nhắc nhở: Sắp đến giờ đặt bàn tại TableGo',
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.order-reminder',
            with: [
                'order' => $this->order,
                'customerName' => $this->order->ho_ten,
                'bookingDate' => \Carbon\Carbon::parse($this->order->booking_date)->format('d/m/Y'),
                'bookingTime' => \Carbon\Carbon::parse($this->order->booking_time)->format('H:i'),
                'tableName' => $this->order->table ? $this->order->table->name : 'Chưa xếp bàn',
            ],
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
