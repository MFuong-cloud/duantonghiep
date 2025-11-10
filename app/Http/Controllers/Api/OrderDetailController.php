<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\OrderDetail;
use Illuminate\Http\Request;
use App\Models\Menu;

class OrderDetailController extends Controller
{
    public function index()
    {
        $details = OrderDetail::with(['order'])->get();
        return response()->json($details);
    }

    public function store(Request $request)
    {
         $request->validate([
            'order_id' => 'required|exists:orders,id',
            'menu_id' => 'required|exists:menus,id',
            'quantity' => 'required|integer|min:1',
        ]);

        // Lấy giá từ bảng menu
        $menu = Menu::find($request->menu_id);
        $price = $menu->price;

        // Kiểm tra xem món này đã có trong đơn hàng chưa
        $existing = OrderDetail::where('order_id', $request->order_id)
            ->where('menu_id', $request->menu_id)
            ->first();

        if ($existing) {
            // Nếu đã tồn tại → cập nhật số lượng
            $existing->quantity += $request->quantity;
            $existing->price = $menu->price; // cập nhật giá hiện tại nếu cần
            $existing->save();

            return response()->json([
                'message' => 'Đã cập nhật số lượng món trong đơn hàng',
                'data' => $existing
            ], 200);
        }

        // Nếu chưa có → tạo mới
        $orderDetail = OrderDetail::create([
            'order_id' => $request->order_id,
            'menu_id' => $request->menu_id,
            'quantity' => $request->quantity,
            'price' => $price,
        ]);

        return response()->json([
            'message' => 'Thêm món vào đơn hàng thành công',
            'data' => $orderDetail
        ], 201);
    }

    

    public function show($id)
    {
        $detail = OrderDetail::with(['order', 'dish'])->find($id);
        if (!$detail) {
            return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng!'], 404);
        }
        return response()->json($detail);
    }

    public function update(Request $request, $id)
    {
        $detail = OrderDetail::find($id);

        if (!$detail) {
            return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng!'], 404);
        }
        
         $request->validate([
            'menu_id' => 'required|exists:menus,id',
            'quantity' => 'required|integer|min:1',
        ]);

    $menu = \App\Models\Menu::find($request->menu_id);

    // 4️⃣ Cập nhật dữ liệu
    $detail->menu_id = $menu->id;
    $detail->quantity = $request->quantity;
    $detail->price = $menu->price; // cập nhật lại giá hiện tại
    $detail->save();

    // 5️⃣ Trả kết quả về
    return response()->json([
        'message' => 'Cập nhật chi tiết món ăn thành công!',
        'data' => $detail
    ], 200);
    }

    public function destroy($id)
    {
        $detail = OrderDetail::find($id);
        if (!$detail) {
            return response()->json(['message' => 'Không tìm thấy chi tiết đơn hàng!'], 404);
        }

        $detail->delete();
        return response()->json(['message' => 'Xóa chi tiết đơn hàng thành công!']);
    }
}
