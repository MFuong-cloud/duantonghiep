<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    // Lấy toàn bộ cài đặt
    public function index()
    {
        return response()->json(Setting::all());
    }

    // Lấy theo key
    public function show($key)
    {
        $setting = Setting::where('key', $key)->first();
        if (!$setting) {
            return response()->json(['message' => 'Setting not found'], 404);
        }

        return response()->json($setting);
    }

    // Cập nhật hoặc tạo mới setting
    public function updateOrCreate(Request $request)
    {
        $request->validate([
            'key' => 'required|string',
            'value' => 'nullable'
        ]);

        $setting = Setting::updateOrCreate(
            ['key' => $request->key],
            ['value' => $request->value]
        );

        return response()->json([
            'message' => 'Setting saved successfully',
            'data' => $setting
        ]);
    }
}
