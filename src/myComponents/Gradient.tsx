import Spline from '@splinetool/react-spline/next';

export default function Gradient() {
  return (
    <div className="relative min-h-screen w-full p-4 sm:p-5 flex items-center justify-center overflow-hidden">
      {/* Background Spline Model */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Spline scene="https://prod.spline.design/2TOJeyduGhMdX1gk/scene.splinecode" />
      </div>

      {/* Main Content Container */}
      <div className="relative flex flex-col lg:flex-row items-center justify-between w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 gap-8 lg:gap-12">
        {/* Left: Text Overlay */}
        <div className="text-center lg:text-left flex-1">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight tracking-tight text-gray-700">
            <span className="block font-sans">Your Journey,</span>
            <span className="block font-serif italic font-medium mt-2 text-gray-600">Her Guidance,</span>
            <span className="block font-sans mt-2">Limitless Possibilities.</span>
          </h1>
        </div>
        
        {/* Right: Spline Model */}
        <div className="w-full max-w-[300px] sm:max-w-[400px] md:max-w-[500px] lg:max-w-[550px] h-[300px] sm:h-[400px] md:h-[500px] lg:h-[550px] flex-shrink-0">
          <Spline
            scene="https://prod.spline.design/pq3ogkFieEA2QGd2/scene.splinecode" 
          />
        </div>
      </div>
    </div>
  );
}
