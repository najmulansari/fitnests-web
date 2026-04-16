"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignUpPage() {
  const [form, setForm] = useState({
    fullName: "",
    studioName: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    // TODO: wire up registration
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{
        background:
          "radial-gradient(ellipse at top left, #fde8e8 0%, #fdf0f0 40%, #f9f9f9 100%)",
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
          <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
          <p className="text-sm text-gray-500 font-mono mt-1 leading-relaxed">
            Start managing your fitness studio
            <br />
            today
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Full Name
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              placeholder="John Doe"
              value={form.fullName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
            />
          </div>

          {/* Studio Name */}
          <div>
            <label
              htmlFor="studioName"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Studio Name
            </label>
            <input
              id="studioName"
              name="studioName"
              type="text"
              autoComplete="organization"
              placeholder="My Fitness Studio"
              value={form.studioName}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
            />
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@studio.com"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1.5"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm py-3 rounded transition-colors"
          >
            Create Account →
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm text-gray-500 font-mono mt-5">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-red-600 font-semibold hover:text-red-700 transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
