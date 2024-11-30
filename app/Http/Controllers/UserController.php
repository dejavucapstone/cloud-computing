<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        // Cek apakah user sudah login
        if (!auth()->check()) {
            return response()->json([
                'message' => 'Silahkan login terlebih dahulu'
            ], 401);
        }

        // Ambil semua user
        $users = User::all();

        return response()->json([
            'message' => 'Data semua user berhasil diambil',
            'users' => $users
        ], 200);
    }
} 