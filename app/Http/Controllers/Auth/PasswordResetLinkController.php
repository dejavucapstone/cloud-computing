<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;

class PasswordResetLinkController extends Controller
{
    /**
     * Handle an incoming password reset link request.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        // Cek rate limiting
        $key = Str::transliterate(Str::lower($request->input('email')).'|'.$request->ip());
        
        if (RateLimiter::tooManyAttempts($key, 2)) { // Maksimal 2 request
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'message' => 'Terlalu banyak percobaan',
                'error' => 'Silakan tunggu ' . $seconds . ' detik sebelum mencoba lagi.'
            ], 429);
        }

        RateLimiter::hit($key, 60); // Cooldown 60 detik

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status == Password::RESET_LINK_SENT) {
            return response()->json([
                'message' => 'Link reset password Berada Di storage/logs/laravel.log',
                'status' => $status
            ], 200);
        }

        if ($status == Password::INVALID_USER) {
            return response()->json([
                'message' => 'Email tidak ditemukan',
                'error' => __($status)
            ], 404);
        }

        return response()->json([
            'message' => 'Gagal mengirim link reset password',
            'error' => __($status)
        ], 400);
    }
}
