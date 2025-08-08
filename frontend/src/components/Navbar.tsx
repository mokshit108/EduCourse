import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="relative z-20 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center group">
            <div className="flex items-center space-x-2">
              <div className="text-2xl animate-float">📚</div>
              <span className="text-xl font-bold text-gradient group-hover:scale-105 transition-transform duration-200">
                EdTech Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-6">
            {/* <Link
              href="/"
              className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                router.pathname === '/' 
                  ? 'text-blue-600 bg-blue-50 shadow-md' 
                  : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
              }`}
            >
              <span className="relative z-10">Courses</span>
              {router.pathname === '/' && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl shadow-glow"></div>
              )}
            </Link> */}

            {user ? (
              <div className="flex items-center space-x-4">
                {/* User Info */}
                <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-600">Welcome, </span>
                    <span className="font-semibold text-gray-800">{user.name}</span>
                  </div>
                </div>

                {/* My Enrollments */}
                {/* <Link
                  href="/my-enrollments"
                  className={`relative px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    router.pathname === '/my-enrollments' 
                      ? 'text-purple-600 bg-purple-50 shadow-md' 
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50/50'
                  }`}
                >
                  My Courses
                </Link> */}

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="btn-secondary text-sm px-4 py-2"
                >
                  Logout
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-primary text-sm px-6 py-2"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg animate-slideInUp">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  router.pathname === '/' 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50/50'
                }`}
              >
                Courses
              </Link>

              {user ? (
                <>
                  <div className="px-4 py-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="text-sm">
                        <span className="text-gray-600">Welcome, </span>
                        <span className="font-semibold text-gray-800">{user.name}</span>
                      </div>
                    </div>
                  </div>

                  {/* // <Link
                  //   href="/my-enrollments"
                  //   onClick={() => setIsMenuOpen(false)}
                  //   className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  //     router.pathname === '/my-enrollments' 
                  //       ? 'text-purple-600 bg-purple-50' 
                  //       : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50/50'
                  //   }`}
                  // >
                  //   My Courses
                  // </Link> */}

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-center btn-primary text-sm px-6 py-3"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;