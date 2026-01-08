<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\Password;

class UserManagementController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email', 'phone', 'role', 'vip_level', 'avatar', 'created_at')
            ->where('role', 'customer')
            ->orderByDesc('created_at')
            ->get()
            ->map(function ($user) {
                $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
                return $user;
            });

        return response()->json($users);
    }


    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|in:customer,employee,manager,owner',
            'phone' => 'required|string|max:15|unique:users,phone',
            'vip_level' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        try {
            \Log::info('Creating user with data:', $request->except(['password', 'avatar']));
            
            $data = [
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
                'role' => $request->role,
                'phone' => $request->phone,
                'vip_level' => $request->vip_level ?? 'none',
            ];


            \Log::info('Checking avatar upload:', [
                'hasFile' => $request->hasFile('avatar'),
                'files' => $request->allFiles(),
                'all' => $request->except(['password'])
            ]);
            
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
                $data['avatar'] = $avatarPath;
                \Log::info('Avatar uploaded:', ['path' => $avatarPath]);
            } else {
                \Log::warning('No avatar file in request');
            }

            $user = User::create($data);

            \Log::info('User created successfully:', ['user_id' => $user->id]);
            
            $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
            
            return response()->json(['message' => 'Tạo người dùng thành công!', 'user' => $user], 201);
        } catch (\Exception $e) {
            \Log::error('Error creating user:', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Lỗi khi tạo người dùng: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $user = User::with('sessions:id,user_id,ip_address,logged_in_at,logged_out_at')
            ->find($id);

        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;

        return response()->json($user);
    }

    public function update(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'phone' => 'sometimes|string|max:15|unique:users,phone,' . $id,
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'password' => 'nullable|string|min:8',
            'vip_level' => 'nullable|string',
            'avatar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        $user->fill($request->only(['name', 'phone', 'email', 'vip_level']));

        if ($request->filled('password')) {
            $user->password = $request->password;
        }

        if ($request->hasFile('avatar')) {
            if ($user->avatar && \Storage::disk('public')->exists($user->avatar)) {
                \Storage::disk('public')->delete($user->avatar);
            }
            
            $avatarPath = $request->file('avatar')->store('avatars', 'public');
            $user->avatar = $avatarPath;
            \Log::info('Avatar updated:', ['user_id' => $id, 'path' => $avatarPath]);
        }

        $user->save();

        $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;

        return response()->json(['message' => 'Cập nhật thành công!', 'user' => $user]);
    }

    public function updateRole(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $request->validate([
            'role' => 'required|in:customer,employee,manager,owner',
        ]);

        $user->role = $request->role;
        $user->save();

        return response()->json(['message' => 'Đã thay đổi vai trò!', 'user' => $user]);
    }

    public function updateAvatar(Request $request, $id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $request->validate([
            'avatar' => 'required|image|mimes:jpg,jpeg,png,webp|max:4096',
        ]);

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $path = $request->file('avatar')->store('avatars', 'public');

        $user->avatar = $path;
        $user->save();

        return response()->json([
            'message' => 'Cập nhật avatar thành công!',
            'avatar_url' => asset('storage/' . $path),
        ]);
    }

    public function deleteAvatar($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        if ($user->avatar && Storage::disk('public')->exists($user->avatar)) {
            Storage::disk('public')->delete($user->avatar);
        }

        $user->avatar = null;
        $user->save();

        return response()->json(['message' => 'Đã xóa avatar!']);
    }

    public function destroy($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json(['message' => 'Không tìm thấy người dùng!'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'Đã xóa người dùng!']);
    }



    public function trash()
    {
        $users = User::onlyTrashed()
            ->orderByDesc('deleted_at')
            ->get()
            ->map(function ($user) {
                $user->avatar_url = $user->avatar ? asset('storage/' . $user->avatar) : null;
                return $user;
            });

        return response()->json($users);
    }

    public function restore($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);
        $user->restore();

        return response()->json([
            'message' => "Khôi phục người dùng \"{$user->name}\" thành công",
            'data' => $user
        ]);
    }

    public function forceDelete($id)
    {
        $user = User::onlyTrashed()->findOrFail($id);

        if ($user->avatar && \Storage::disk('public')->exists($user->avatar)) {
            \Storage::disk('public')->delete($user->avatar);
        }

        $user->forceDelete();

        return response()->json([
            'message' => "Xóa vĩnh viễn người dùng \"{$user->name}\" thành công"
        ]);
    }
}
