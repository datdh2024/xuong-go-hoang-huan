import Link from 'next/link'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import FloatingCTA from '@/components/layout/FloatingCTA'

function WoodworkingIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-24 h-24 mx-auto mb-6 opacity-60"
    >
      {/* Wood plank base */}
      <rect x="10" y="75" width="100" height="14" rx="3" fill="#c9a14a" opacity="0.4" />
      <rect x="10" y="75" width="100" height="3" rx="1" fill="#c9a14a" opacity="0.6" />
      {/* Chisel tool */}
      <rect x="52" y="20" width="10" height="55" rx="2" fill="#8b5e3c" />
      <polygon points="52,72 62,72 65,85 49,85" fill="#5a280e" />
      <rect x="50" y="16" width="14" height="8" rx="2" fill="#2a1005" />
      {/* Decorative wood grain lines */}
      <line x1="15" y1="80" x2="105" y2="80" stroke="#c9a14a" strokeWidth="0.8" opacity="0.5" />
      <line x1="15" y1="84" x2="105" y2="84" stroke="#c9a14a" strokeWidth="0.8" opacity="0.3" />
      {/* Corner ornaments */}
      <circle cx="18" cy="77.5" r="3" fill="#c9a14a" opacity="0.5" />
      <circle cx="102" cy="77.5" r="3" fill="#c9a14a" opacity="0.5" />
    </svg>
  )
}

export default function NotFoundPage() {
  return (
    <>
      <Header />
      <main>
        <section className="min-h-[70vh] bg-gradient-to-b from-wood-50 to-wood-100 flex flex-col items-center justify-center px-4 py-20 text-center">
          <WoodworkingIcon />

          {/* 404 with ornamental gold framing */}
          <div className="flex items-center gap-4 mb-6">
            <span className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-500 max-w-[80px]" />
            <p className="text-gold-500 font-cormorant font-bold text-7xl md:text-8xl leading-none tracking-wider">
              404
            </p>
            <span className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-500 max-w-[80px]" />
          </div>
          {/* Ornamental divider under 404 */}
          <div className="flex items-center gap-2 mb-8">
            <span className="w-12 h-px bg-gold-400" />
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span className="w-16 h-px bg-gold-400" />
            <span className="w-2 h-2 rounded-full bg-gold-400" />
            <span className="w-12 h-px bg-gold-400" />
          </div>

          <h1 className="font-cormorant text-wood-800 text-4xl md:text-5xl font-semibold mb-4">
            Trang không tồn tại
          </h1>
          <p className="text-wood-600 text-lg mb-10 max-w-md">
            Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển. Hãy quay lại trang chủ hoặc liên hệ với chúng tôi.
          </p>

          <nav className="flex flex-wrap gap-4 justify-center mb-12" aria-label="Điều hướng 404">
            <Link
              href="/"
              className="bg-gold-500 text-white px-8 py-3 rounded hover:bg-gold-600 transition-colors font-semibold shadow-sm"
            >
              Trang chủ
            </Link>
            <Link
              href="/cong-trinh"
              className="border border-wood-800 text-wood-800 px-6 py-3 rounded hover:bg-wood-100 transition-colors font-medium"
            >
              Công trình
            </Link>
            <Link
              href="/lien-he"
              className="border border-wood-700 text-wood-700 px-6 py-3 rounded hover:bg-wood-100 transition-colors font-medium"
            >
              Liên hệ
            </Link>
          </nav>

          {/* Phone CTA — clearly separated */}
          <div className="border-t border-wood-200 pt-8 w-full max-w-sm">
            <p className="text-wood-500 mb-3 text-sm uppercase tracking-widest">Hoặc gọi trực tiếp</p>
            <a
              href="tel:0985241204"
              className="inline-flex items-center gap-2 bg-gold-500 text-white px-8 py-3 rounded font-semibold hover:bg-gold-600 transition-colors"
            >
              0985 241 204
            </a>
          </div>
        </section>
      </main>
      <Footer />
      <FloatingCTA />
    </>
  )
}
