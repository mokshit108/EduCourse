import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { LoginInput } from '../types';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const { login, user, loading } = useAuth();
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginInput>();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      router.push('/');
    }
  }, [user, loading, router]);

  const onSubmit = async (data: LoginInput) => {
    try {
      setIsLoading(true);
      setLoginError('');
      await login(data.email, data.password);
      router.push('/');
    } catch (error: any) {
      setLoginError(error.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fillDemoCredentials = (email: string, password: string) => {
    setValue('email', email);
    setValue('password', password);
  };

  if (loading || user) {
    return (
      <Layout title="Login - EdTech Platform">
        <LoadingSpinner 
          size="large" 
          message="Checking authentication..." 
          fullScreen={false}
        />
      </Layout>
    );
  }

  return (
    <Layout title="Login - EdTech Platform">
      <div className="min-h-[80vh] flex items-center justify-center py-12">
        <div className="max-w-md w-full mx-4">
          {/* Login Card */}
          <div className="card p-8 animate-fadeIn">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="text-5xl mb-4 animate-float">🎓</div>
              <h1 className="text-3xl font-bold text-gradient mb-2">
                Welcome Back
              </h1>
              <p className="text-gray-600">
                Sign in to your account to continue your learning journey
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                  📧 Email Address
                </label>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address',
                    },
                  })}
                  type="email"
                  id="email"
                  className={`input-field ${
                    errors.email ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                  placeholder="Enter your email address"
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.email.message}</span>
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-3">
                  🔒 Password
                </label>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters',
                    },
                  })}
                  type="password"
                  id="password"
                  className={`input-field ${
                    errors.password ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''
                  }`}
                  placeholder="Enter your password"
                />
                {errors.password && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <span>⚠️</span>
                    <span>{errors.password.message}</span>
                  </p>
                )}
              </div>

              {/* Login Error */}
              {loginError && (
                <div className="bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-slideInUp">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg">❌</span>
                    <span className="font-medium">{loginError}</span>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
                  isLoading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'btn-primary'
                } text-white`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <span>Sign In</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </div>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
              <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center space-x-2">
                <span>🚀</span>
                <span>Quick Demo Access</span>
              </h3>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('john@example.com', 'password123')}
                  className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-blue-800 text-sm">👨‍🎓 Student Account</div>
                      <div className="text-xs text-blue-600">john@example.com</div>
                    </div>
                    <svg className="w-4 h-4 text-blue-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('jane@example.com', 'password123')}
                  className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-green-800 text-sm">👩‍🎓 Student Account</div>
                      <div className="text-xs text-green-600">jane@example.com</div>
                    </div>
                    <svg className="w-4 h-4 text-green-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
                
                <button
                  type="button"
                  onClick={() => fillDemoCredentials('prof@example.com', 'password123')}
                  className="w-full text-left p-3 bg-white/80 hover:bg-white rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200 group"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-purple-800 text-sm">👨‍🏫 Professor Account</div>
                      <div className="text-xs text-purple-600">prof@example.com</div>
                    </div>
                    <svg className="w-4 h-4 text-purple-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-3 text-center">
                Click any account above to auto-fill the login form
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LoginPage;