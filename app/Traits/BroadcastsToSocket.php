<?php

namespace App\Traits;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

trait BroadcastsToSocket
{
    /**
     * Broadcast order update to Socket.IO server
     *
     * @param \App\Models\Order $order
     * @param string $event
     * @return void
     */
    protected function broadcastOrderUpdate($order, $event = 'order:updated')
    {
        try {
            $socketUrl = env('SOCKET_IO_SERVER_URL', 'http://localhost:3001');
            
            Http::post($socketUrl . '/api/broadcast', [
                'event' => $event,
                'data' => [
                    'id' => $order->id,
                    'code' => $order->code,
                    'status' => $order->status,
                    'user_id' => $order->user_id,
                    'booking_date' => $order->booking_date,
                    'booking_time' => $order->booking_time,
                ]
            ]);
        } catch (\Exception $e) {
            Log::warning("Failed to broadcast {$event} to Socket.IO: " . $e->getMessage());
        }
    }

    /**
     * Broadcast table update to Socket.IO server
     *
     * @param \App\Models\RestaurantTable $table
     * @param string $event
     * @return void
     */
    protected function broadcastTableUpdate($table, $event = 'table:updated')
    {
        try {
            $socketUrl = env('SOCKET_IO_SERVER_URL', 'http://localhost:3001');
            
            Http::post($socketUrl . '/api/broadcast', [
                'event' => $event,
                'data' => [
                    'id' => $table->id,
                    'name' => $table->name,
                    'status' => $table->status,
                    'capacity' => $table->capacity,
                ]
            ]);
        } catch (\Exception $e) {
            Log::warning("Failed to broadcast {$event} to Socket.IO: " . $e->getMessage());
        }
    }
}
