import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Layout from '../../components/Layout';
import { GET_COURSE } from '../../graphql/queries';
import { Course } from '../../types';
import { useAuth } from '../../context/AuthContext';

const EnrollmentConfirmationPage: React.FC = () => {
  const router = useRouter();
  const { courseId } = router.query;
  const { user } = useAuth();
  const [countdown, setCountdown] = useState(5);

  const { data, loading } = useQuery(GET_COURSE, {
    variables: { id: courseId },
    skip: !courseId,
  });

  // Redirect countdown
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      router.push('/');
    }
  }, [countdown, router]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user && !loading) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !data?.course) {
    return (
      <Layout title="Enrollment Confirmation">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  const course: Course = data.course;

  return (
    <Layout title="Enrollment Successful - EdTech Platform">
      <div className="max-w-2xl mx-auto text-center py-12">
        {/* Success Icon */}
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <div className="text-4xl text-green-600">✅</div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Enrollment Successful!
        </h1>
        
        <p className="text-xl text-gray-600 mb-8">
          Congratulations! You have successfully enrolled in
        </p>

        {/* Course Info Card */}
        <div className="bg-white border-2 border-green-200 rounded-lg p-6 mb-8 max-w-md mx-auto">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {course.title}
          </h2>
          <div className="flex justify-center items-center space-x-4 text-sm text-gray-600">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
              {course.level}
            </span>
            <span>
              {course.enrollments?.length || 0} students enrolled
            </span>
          </div>
          <p className="text-gray-600 mt-4 line-clamp-2">
            {course.description}
          </p>
        </div>

        {/* Next Steps */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            What's Next?
          </h3>
          <div className="space-y-3 text-blue-700">
            <div className="flex items-center justify-center space-x-2">
              <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">1</span>
              <span>Access your course materials and content</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">2</span>
              <span>Connect with instructors and fellow students</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <span className="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-sm font-semibold">3</span>
              <span>Start learning and complete assignments</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <button
            onClick={() => router.push(`/course/${course.id}`)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Course
          </button>
          <button
            onClick={() => router.push('/')}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-8 py-3 rounded-lg font-medium transition-colors"
          >
            Browse More Courses
          </button>
        </div>

        {/* Auto Redirect Notice */}
        <div className="text-sm text-gray-500">
          You will be automatically redirected to the home page in{' '}
          <span className="font-semibold text-blue-600">{countdown}</span>{' '}
          {countdown === 1 ? 'second' : 'seconds'}
        </div>
      </div>
    </Layout>
  );
};

export default EnrollmentConfirmationPage;