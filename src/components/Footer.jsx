export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-[10px] leading-none">
              A<br />O
            </span>
          </div>
          <span className="font-bold text-xs tracking-widest uppercase text-gray-900">
            ApexOps
          </span>
        </div>

        <p className="text-xs text-gray-400">
          © 2026 ApexOps. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
