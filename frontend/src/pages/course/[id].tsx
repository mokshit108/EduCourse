import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import Layout from '../../components/Layout';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import { GET_COURSE, ENROLL_IN_COURSE, GET_COURSES } from '../../graphql/queries';
import { Course, CourseLevel, EnrollmentRole } from '../../types';
import { useAuth } from '../../context/AuthContext';

const CourseDetailPage: React.FC = () => {
  const router = useRouter();
  const { id, updated } = router.query;
  const { user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);
  const [showUpdateSuccess, setShowUpdateSuccess] = useState(false);

  const { data, loading, error, refetch } = useQuery(GET_COURSE, {
    variables: { id },
    skip: !id,
  });

  const [enrollInCourse] = useMutation(ENROLL_IN_COURSE, {
    refetchQueries: [{ query: GET_COURSES }],
  });

  // Show success message if course was just updated
  useEffect(() => {
    if (updated === 'true') {
      setShowUpdateSuccess(true);
      // Remove the query parameter from URL
      router.replace(`/course/${id}`, undefined, { shallow: true });
      // Hide success message after 5 seconds
      setTimeout(() => setShowUpdateSuccess(false), 5000);
    }
  }, [updated, id, router]);

  if (loading) {
    return (
      <Layout title="Loading Course...">
        <LoadingSpinner 
          size="large" 
          message="Loading course details..." 
          fullScreen={false}
        />
      </Layout>
    );
  }

  if (error || !data?.course) {
    return (
      <Layout title="Course Not Found">
        <ErrorMessage
          title="Course Not Found"
          message="The course you're looking for doesn't exist or may have been removed."
          onRetry={() => refetch()}
          fullScreen={false}
        />
      </Layout>
    );
  }

  const course: Course = data.course;
  const isEnrolled = !!course.userEnrollment;
  const userRole = course.userEnrollment?.role;
  const professors = course.enrollments?.filter(e => e.role === EnrollmentRole.PROFESSOR) || [];
  const students = course.enrollments?.filter(e => e.role === EnrollmentRole.STUDENT) || [];

  const getLevelColor = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return 'badge-green';
      case CourseLevel.INTERMEDIATE:
        return 'badge-yellow';
      case CourseLevel.ADVANCED:
        return 'badge-red';
      default:
        return 'badge bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      setEnrolling(true);
      await enrollInCourse({
        variables: { courseId: course.id },
      });
      await refetch();
      router.push('/enrollment/confirmation?courseId=' + course.id);
    } catch (error: any) {
      alert('Enrollment failed: ' + error.message);
    } finally {
      setEnrolling(false);
    }
  };

  return (
    <Layout title={`${course.title} - EdTech Platform`}>
      <div className="max-w-6xl mx-auto animate-fadeIn">
        {/* Success Message */}
        {showUpdateSuccess && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 animate-fadeIn">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <p className="text-green-700 font-medium">Course updated successfully!</p>
              <button
                onClick={() => setShowUpdateSuccess(false)}
                className="ml-auto text-green-500 hover:text-green-700"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-8 transition-colors duration-200"
        >
          <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-semibold">Back to Courses</span>
        </button>

        {/* Course Hero Section */}
        <div className="card overflow-hidden mb-8">
          {/* Course Header Image */}
          <div className="relative h-64 bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700">
            <div className="absolute inset-0 bg-black/30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4 animate-float">📚</div>
                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                <div className="flex items-center justify-center space-x-4">
                  <span className={`${getLevelColor(course.level)} text-sm font-bold uppercase tracking-wide`}>
                    {course.level} Level
                  </span>
                  {isEnrolled && userRole && (
                    <span className={`${
                      userRole === EnrollmentRole.PROFESSOR ? 'badge-purple' : 'badge-blue'
                    } text-sm font-bold`}>
                      {userRole === EnrollmentRole.PROFESSOR ? '👨‍🏫 Professor' : '👨‍🎓 Student'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-8">
            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              {user && userRole === EnrollmentRole.PROFESSOR && (
                <button
                  onClick={() => router.push(`/course/${course.id}/edit`)}
                  className="btn-secondary bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white border-0"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Course
                </button>
              )}

              {user && !isEnrolled && (
                <button
                  onClick={handleEnroll}
                  disabled={enrolling}
                  className={`btn-primary ${enrolling ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {enrolling ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Enrolling...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span>Enroll Now</span>
                    </div>
                  )}
                </button>
              )}

              {!user && (
                <button
                  onClick={() => router.push('/login')}
                  className="btn-primary"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  Login to Enroll
                </button>
              )}
            </div>

            {/* Course Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="card-gradient p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {course.enrollments?.length || 0}
                </div>
                <div className="text-gray-600 font-medium">Total Enrolled</div>
              </div>
              <div className="card-gradient p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {professors.length}
                </div>
                <div className="text-gray-600 font-medium">Instructors</div>
              </div>
              <div className="card-gradient p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {students.length}
                </div>
                <div className="text-gray-600 font-medium">Students</div>
              </div>
            </div>
          </div>
        </div>

        {/* Course Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Course Description */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
                <span>📖</span>
                <span>About This Course</span>
              </h2>
              <p className="text-gray-700 leading-relaxed text-lg">
                {course.description}
              </p>
            </div>
          </div>

          {/* Course Information Sidebar */}
          <div className="space-y-6">
            {/* Instructors */}
            {professors.length > 0 && (
              <div className="card p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <span>👨‍🏫</span>
                  <span>Instructors ({professors.length})</span>
                </h3>
                <div className="space-y-4">
                  {professors.map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full flex items-center justify-center text-white font-bold">
                        {enrollment.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-gray-900">
                          {enrollment.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {enrollment.user.email}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Course Content Section */}
        {isEnrolled ? (
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <span>📚</span>
              <span>Course Content</span>
            </h2>
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-6 animate-float">🎓</div>
              <h3 className="text-2xl font-bold text-blue-900 mb-4">
                Welcome to {course.title}!
              </h3>
              <p className="text-blue-700 text-lg mb-6 max-w-2xl mx-auto">
                Course content and materials would be displayed here. 
                This is where students would access lessons, assignments, and resources.
              </p>
              {userRole === EnrollmentRole.PROFESSOR && (
                <div className="bg-purple-100 border border-purple-200 rounded-xl p-4 mt-6">
                  <p className="text-purple-800 font-medium">
                    👨‍🏫 As a professor, you can manage course content, view student progress, 
                    and interact with enrolled students.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="card p-8 text-center">
            <div className="text-6xl text-gray-400 mb-6">🔒</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-4">
              Enroll to Access Course Content
            </h3>
            <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
              Sign up for this course to access all materials, assignments, and discussions.
            </p>
            {!user ? (
              <button
                onClick={() => router.push('/login')}
                className="btn-primary"
              >
                Login to Get Started
              </button>
            ) : (
              <button
                onClick={handleEnroll}
                disabled={enrolling}
                className="btn-primary"
              >
                {enrolling ? 'Enrolling...' : 'Enroll Now'}
              </button>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CourseDetailPage;