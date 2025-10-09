<?php

namespace App\Http\Requests\Branch;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBranchRequest extends FormRequest
{
    public function authorize(): bool
    {
        // Sau này có thể check quyền owner hoặc manager
        return true;
    }

    public function rules(): array
    {
        $branchId = $this->route('branch');

        return [
            'name' => 'sometimes|string|max:255',
            'address' => 'nullable|string|max:500',
            'phone' => 'nullable|string|max:20',
            'email' => "nullable|email|max:255|unique:branches,email,{$branchId}",
        ];
    }

    public function messages(): array
    {
        return [
            'email.unique' => 'Email này đã được sử dụng bởi chi nhánh khác.',
        ];
    }
}
