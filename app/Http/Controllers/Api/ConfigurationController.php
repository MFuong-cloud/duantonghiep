<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Configuration;
use Illuminate\Http\Request;
class ConfigurationController extends Controller
{
    // Lấy thông tin cấu hình (cho FE hiển thị header)
   public function index($branchId = null)
{
    if ($branchId) {
        $config = Configuration::where('branch_id', $branchId)->first();
    }

    // Nếu không tìm thấy hoặc không có branch_id => lấy config mặc định
    $config = $config ?? Configuration::first();

    return response()->json($config);
}



    // Cập nhật hoặc tạo mới cấu hình (cho admin)
    public function update(Request $request)
    {
        $config = Configuration::first();

        if (!$config) {
            $config = new Configuration();
        }

        $config->fill($request->only([
            'restaurant_name',
            'phone',
            'email',
            'address',
            'open_time',
            'close_time',
            'max_people_per_table',
            'description',
        ]));

        $config->save();

        return response()->json([
            'message' => 'Cấu hình đã được lưu thành công!',
            'data' => $config,
        ]);
    }
}
