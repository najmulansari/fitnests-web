"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs leading-none">
              A<br />O
            </span>
          </div>
          <span className="font-bold text-sm tracking-widest uppercase text-gray-900">
            ApexOps
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <Link
            href="/list-studio"
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            List Your Studio
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    </nav>
  );
}
