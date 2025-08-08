import Spline from '@splinetool/react-spline/next';

export default function Gradient() {
  return (
    <div className="relative min-h-screen w-full p-4 sm:p-5 flex items-center justify-center overflow-hidden">
      {/* Background Spline Model */}
      <div className="absolute inset-0 w-full h-[90vh] md:h-full overflow-hidden">
        <Spline scene="https://prod.spline.design/2TOJeyduGhMdX1gk/scene.splinecode" />
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
        
        {/* Right: Spline Model */}
        <div className="hidden lg:block lg:max-w-[550px] lg:h-[550px] flex-shrink-0 -mt-16 mr-7">
          <Spline
            scene="https://prod.spline.design/pq3ogkFieEA2QGd2/scene.splinecode" 
          />
        </div>
      </div>
    </div>
  );
}
