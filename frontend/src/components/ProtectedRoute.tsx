import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { EnrollmentRole } from '../types';
import { hasRoleInCourse, isEnrolledInCourse } from '../utils/roleUtils';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAuth?: boolean;
  requiredRole?: EnrollmentRole;
  courseId?: string;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requireAuth = true,
  requiredRole,
  courseId,
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return; // Wait for auth to load

    // Check if authentication is required
    if (requireAuth && !user) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access
    if (requiredRole && user && courseId) {
      const hasRequiredRole = hasRoleInCourse(user, courseId, requiredRole);

      if (!hasRequiredRole) {
        // Redirect based on user's role
        if (hasRoleInCourse(user, courseId, EnrollmentRole.STUDENT)) {
          router.push(`/course/${courseId}`); // Students go to course view
        } else {
          router.push('/'); // Others go to home
        }
        return;
      }
    }

    // Check if user has any enrollment in the course (for course-specific pages)
    if (courseId && user && !requiredRole) {
      const enrolled = isEnrolledInCourse(user, courseId);

      if (!enrolled) {
        router.push(`/course/${courseId}`); // Redirect to course page to enroll
        return;
      }
    }
  }, [user, loading, router, requireAuth, requiredRole, courseId, redirectTo]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Show access denied for role-based restrictions
  if (requireAuth && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-8xl text-gray-300 mb-6">🔒</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            You need to be logged in to access this page.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;