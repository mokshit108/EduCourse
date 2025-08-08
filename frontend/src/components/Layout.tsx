import React from 'react';
import Head from 'next/head';
import Navbar from './Navbar';
import { LayoutProps } from '../types';

const Layout: React.FC<LayoutProps> = ({ children, title = 'EdTech Platform' }) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Mini EdTech Learning Platform - Learn, Grow, Excel" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Background decoration */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
        </div>
        
        <Navbar />
        
        <main className="relative z-10 container mx-auto px-4 py-8 animate-fadeIn">
          {children}
        </main>
        
        <footer className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-900 text-white mt-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10"></div>
          <div className="relative container mx-auto px-4 py-12">
            <div className="text-center">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gradient mb-2">📚 EdTech Platform</h3>
                <p className="text-gray-300 max-w-md mx-auto">
                  Empowering learners worldwide with cutting-edge educational technology
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-300">Platform</h4>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Interactive Courses</p>
                    <p>Expert Instructors</p>
                    <p>Progress Tracking</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-indigo-300">Technology</h4>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Next.js & React</p>
                    <p>GraphQL API</p>
                    <p>PostgreSQL Database</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-purple-300">Features</h4>
                  <div className="space-y-1 text-sm text-gray-400">
                    <p>Real-time Learning</p>
                    <p>Course Management</p>
                    <p>Student Analytics</p>
                  </div>
                </div>
              </div>
              
              <div className="border-t border-gray-700 pt-6">
                <p className="text-gray-400 text-sm">
                  &copy; 2024 EdTech Platform. All rights reserved.
                </p>
                <p className="text-gray-500 text-xs mt-2">
                  Built with ❤️ using modern web technologies
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Layout;