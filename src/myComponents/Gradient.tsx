"use client";

export default function Gradient() {
  return (
    <div className="relative min-h-screen w-full p-4 sm:p-5 flex items-center justify-center overflow-hidden">
      {/* Lightweight CSS-only background (replaces the removed Spline 3D scene) */}
      <div className="absolute inset-0 w-full h-[90vh] md:h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[36rem] h-[36rem] bg-purple-300/40 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-[32rem] h-[32rem] bg-pink-300/40 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/4 w-[30rem] h-[30rem] bg-blue-300/30 rounded-full blur-3xl" />
      </div>

      {/* Main Content Container */}
      <div className="relative flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 gap-8 lg:gap-12" style={{ height: '60vh' }}>
        {/* Left: Text Overlay */}
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-7xl font-bold leading-tight tracking-tight text-gray-700 mt-16 sm:mb-32">
            <span className="block font-sans">Your Journey,</span>
            <span className="block font-serif italic font-medium mt-2 text-gray-600">Her Guidance,</span>
            <span className="block font-sans mt-2">Limitless Possibilities.</span>
          </h1>
        </div>

        {/* Right: Hero illustration (girl with laptop, transparent cutout) */}
        <div className="hidden lg:block flex-shrink-0 -mt-16 mr-7 w-[420px] relative" aria-hidden="true">
          <div className="absolute -inset-6 rounded-full bg-gradient-to-br from-purple-400/50 via-pink-300/40 to-blue-400/50 blur-2xl" />
          {/* Floating decorative elements */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-flower.png"
            alt=""
            className="absolute -top-4 left-2 w-24 z-10"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-chat.png"
            alt=""
            className="absolute top-[22%] -left-8 w-24 z-10"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-heart.png"
            alt=""
            className="absolute top-[52%] -left-4 w-12 z-10"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/hero-girl.png"
            alt=""
            className="relative w-full h-auto [filter:drop-shadow(0_24px_40px_rgba(168,85,247,0.35))]"
          />
        </div>
      </div>
    </div>
  );
}
