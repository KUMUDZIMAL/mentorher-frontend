import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      {/* Partnership Section - Full width with inner container */}
      <div className="w-full bg-white/80 backdrop-blur-lg py-12 sm:py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">Want to partner with us?</h2>
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 px-4">
              If you're interested in our partnership and would like to find out more, 
              one of our advisors would be excited to help.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 sm:px-8 py-3 rounded-full text-base sm:text-lg font-medium hover:opacity-90 transition-opacity">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Full width */}
      <div className="w-full py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* Column 1 */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">MentorHer</h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 leading-relaxed">
              Empowering women through mentorship and professional growth.
            </p>
            <div className="flex justify-center sm:justify-start space-x-4">
              <a href="#" className="text-purple-600 hover:text-pink-500 transition-colors">
                <Twitter size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-purple-600 hover:text-pink-500 transition-colors">
                <Linkedin size={18} className="sm:w-5 sm:h-5" />
              </a>
              <a href="#" className="text-purple-600 hover:text-pink-500 transition-colors">
                <Instagram size={18} className="sm:w-5 sm:h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="/" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">Home</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">Services</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Resources</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">FAQs</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">Career Guides</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-600 hover:text-purple-600 transition-colors">Mentorship Tips</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div className="text-center sm:text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Contact Us</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li className="flex items-center justify-center sm:justify-start text-gray-600">
                <Mail className="mr-2 text-purple-600" size={16} />
                <span className="text-sm sm:text-base">contact@mentorher.com</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start text-gray-600">
                <Phone className="mr-2 text-purple-600" size={16} />
                <span className="text-sm sm:text-base">+918767281279</span>
              </li>
              <li className="flex items-center justify-center sm:justify-start text-gray-600">
                <MapPin className="mr-2 text-purple-600" size={16} />
                <span className="text-sm sm:text-base">Marine Lines, Mumbai</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Full width */}
      <div className="w-full border-t border-gray-200 py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <div className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
            © {new Date().getFullYear()} MentorHer. All rights reserved.
          </div>
          <div className="flex flex-wrap justify-center sm:justify-end space-x-4 sm:space-x-6">
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-purple-600 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-purple-600 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs sm:text-sm text-gray-500 hover:text-purple-600 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}