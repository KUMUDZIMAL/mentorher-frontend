import { Mail, Phone, MapPin, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-gradient-to-b from-white to-gray-50 border-t border-gray-200">
      {/* Partnership Section - Full width with inner container */}
      <div className="w-full bg-white/80 backdrop-blur-lg py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Want to partner with us?</h2>
            <p className="text-lg text-gray-600 mb-8">
              If you're interested in our partnership and would like to find out more, 
              one of our advisors would be excited to help.
            </p>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-3 rounded-full text-lg font-medium hover:opacity-90 transition-opacity">
              Contact Our Team
            </button>
          </div>
        </div>
      </div>

      {/* Main Footer Content - Full width */}
      <div className="w-full py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">MentorHer</h3>
            <p className="text-gray-600 mb-4">
              Empowering women through mentorship and professional growth.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-purple-600 hover:text-pink-500"><Twitter size={20} /></a>
              <a href="#" className="text-purple-600 hover:text-pink-500"><Linkedin size={20} /></a>
              <a href="#" className="text-purple-600 hover:text-pink-500"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="/" className="text-gray-600 hover:text-purple-600 transition-colors">Home</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Services</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">About Us</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Success Stories</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Resources</h3>
            <ul className="space-y-3">
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Blog</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">FAQs</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Career Guides</a></li>
              <li><a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">Mentorship Tips</a></li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center text-gray-600">
                <Mail className="mr-2 text-purple-600" size={18} />
                contact@mentorher.com
              </li>
              <li className="flex items-center text-gray-600">
                <Phone className="mr-2 text-purple-600" size={18} />
                +918767281279
              </li>
              <li className="flex items-center text-gray-600">
                <MapPin className="mr-2 text-purple-600" size={18} />
           Marine Lines,Mumbai
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Footer - Full width */}
      <div className="w-full border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center">
          <div className="text-gray-500 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} MentorHer. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-purple-600 text-sm">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}