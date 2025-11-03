<?php
// app/Http/Controllers/Api/SettingController.php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    public function getConfig()
    {
        $config = Setting::first();
        return response()->json($config);
    }

    public function updateConfig(Request $request)
    {
        $validated = $request->validate([
            'restaurant_name' => 'required|string',
            'address' => 'required|string',
            'phone' => 'required|string',
            'tax_code' => 'nullable|string'
        ]);

        $config = Setting::first();
        if (!$config) {
            $config = Setting::create($validated);
        } else {
            $config->update($validated);
        }

        return response()->json([
            'message' => 'Cập nhật thành công',
            'data' => $config
        ]);
    }
}

