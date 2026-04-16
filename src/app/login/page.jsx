"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { login } from "@/lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      router.push("/admin/manage-listings");
    } else {
      setError(result.error);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background: "radial-gradient(ellipse at top left, #fde8e8 0%, #fdf0f0 40%, #f9f9f9 100%)",
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-9 h-9 bg-red-600 rounded flex items-center justify-center">
          <span className="text-white font-bold text-xs leading-none">
            A<br />O
          </span>
        </div>
        <span className="font-bold text-sm tracking-widest uppercase text-red-600">
          ApexOps
        </span>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-white border border-gray-200 rounded p-8 shadow-sm">
        {/* Heading */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Login</h1>
          <p className="text-sm text-gray-500 font-mono mt-1">
            Sign in to your studio dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2.5 rounded">
              <span className="shrink-0">⚠</span>
              {error}
            </div>
          )}

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@studio.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
            />
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                required
                className="w-full border border-gray-300 rounded px-3 py-2.5 pr-10 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white font-semibold text-sm py-3 rounded transition-colors"
          >
            {loading ? "Signing in…" : "Login →"}
          </button>
        </form>

        {/* Sign up link */}
        <p className="text-center text-sm text-gray-500 font-mono mt-5">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
