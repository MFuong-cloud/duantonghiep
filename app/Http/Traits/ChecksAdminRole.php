<?php

namespace App\Http\Traits;

trait ChecksAdminRole
{
    /**
     * Kiểm tra xem user có phải admin không
     * Admin bao gồm: owner, manager, employee
     * 
     * @param \App\Models\User|null $user
     * @return bool
     */
    protected function isAdmin($user = null): bool
    {
        if (!$user) {
            $user = auth()->user();
        }

        if (!$user) {
            return false;
        }

        $adminRoles = ['owner', 'manager', 'employee'];
        return in_array($user->role, $adminRoles);
    }

    /**
     * Lấy danh sách các role admin
     * 
     * @return array
     */
    protected function getAdminRoles(): array
    {
        return ['owner', 'manager', 'employee'];
    }
}
