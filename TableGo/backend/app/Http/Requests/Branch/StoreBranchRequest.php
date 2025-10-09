<?php

namespace App\Http\Requests\Branch;

use Illuminate\Foundation\Http\FormRequest;

class StoreBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Sau này có thể check role (VD: chỉ owner mới được tạo chi nhánh)
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => 'nullable|email|max:255|unique:branches,email',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Tên chi nhánh là bắt buộc.',
            'email.unique' => 'Email này đã tồn tại.',
        ];
    }
}
