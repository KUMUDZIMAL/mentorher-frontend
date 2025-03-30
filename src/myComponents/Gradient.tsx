import Spline from '@splinetool/react-spline/next';

export default function Gradient() {
  return (
    <div className="relative h-screen w-screen p-5 flex items-center justify-center">
      {/* Background Spline Model */}
      <div className="absolute inset-0 h-full w-full overflow-hidden">
        <Spline scene="https://prod.spline.design/2TOJeyduGhMdX1gk/scene.splinecode" />
      </div>

      {/* Main Content Container */}
      <div className="relative flex items-center justify-between w-full max-w-[1200px] px-8 z-10">
        {/* Left: Text Overlay */}
        <div className="text-left">
          <h1 className="text-8xl md:text-7xl lg:text-7xl font-bold leading-tight tracking-tight text-gray-700">
            <span className="block font-sans">Your Journey,</span>
            <span className="block font-serif italic font-medium mt-2 text-gray-600">Her Guidance,</span>
            <span className="block font-sans mt-2">Limitless Possibilities.</span>
          </h1>
        </div>

        {/* Right: Second Spline Model */}
        <div className="w-[550px] h-[550px] ml-30 mt-10 md:w-[650px] md:h-[650px] lg:w-[550px] lg:h-[550px]">
      
        <Spline
        scene="https://prod.spline.design/pq3ogkFieEA2QGd2/scene.splinecode" 
      />

 
        </div>
      </div>
    </div>
  );
}
