import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import Layout from '../../../components/Layout';
import ProtectedRoute from '../../../components/ProtectedRoute';
import LoadingSpinner from '../../../components/LoadingSpinner';
import ErrorMessage from '../../../components/ErrorMessage';
import { GET_COURSE, UPDATE_COURSE, GET_COURSES } from '../../../graphql/queries';
import { Course, CourseLevel, EnrollmentRole, UpdateCourseInput } from '../../../types';
import { useAuth } from '../../../context/AuthContext';

const EditCoursePage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  
  const [formData, setFormData] = useState<UpdateCourseInput>({
    title: '',
    description: '',
    level: CourseLevel.BEGINNER
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_COURSE, {
    variables: { id },
    skip: !id,
  });

  const [updateCourse] = useMutation(UPDATE_COURSE, {
    refetchQueries: [
      { query: GET_COURSES },
      { query: GET_COURSE, variables: { id } }
    ],
  });

  // Initialize form data when course data loads
  useEffect(() => {
    if (data?.course) {
      const course: Course = data.course;
      setFormData({
        title: course.title,
        description: course.description,
        level: course.level
      });
    }
  }, [data]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (submitError) setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim() || !formData.description?.trim()) {
      setSubmitError('Title and description are required');
      return;
    }

    try {
      setIsSubmitting(true);
      setSubmitError(null);

      await updateCourse({
        variables: {
          id,
          input: {
            title: formData.title.trim(),
            description: formData.description.trim(),
            level: formData.level
          }
        }
      });

      // Show success message and redirect
      router.push(`/course/${id}?updated=true`);
    } catch (error: any) {
      console.error('Update course error:', error);
      setSubmitError(error.message || 'Failed to update course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push(`/course/${id}`);
  };

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
          message="The course you're trying to edit doesn't exist or may have been removed."
          onRetry={() => refetch()}
          fullScreen={false}
        />
      </Layout>
    );
  }

  const course: Course = data.course;

  return (
    <ProtectedRoute 
      requireAuth={true}
      requiredRole={EnrollmentRole.PROFESSOR}
      courseId={id as string}
    >
      <Layout title={`Edit ${course.title} - EdTech Platform`}>
        <div className="max-w-4xl mx-auto animate-fadeIn">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={handleCancel}
              className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 mb-6 transition-colors duration-200"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span className="font-semibold">Back to Course</span>
            </button>

            <div className="text-center">
              <div className="text-6xl mb-4">✏️</div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Edit Course</h1>
              <p className="text-gray-600 text-lg">
                Update your course information and settings
              </p>
            </div>
          </div>

          {/* Edit Form */}
          <div className="card p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Field */}
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter course title"
                  required
                />
              </div>

              {/* Description Field */}
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-vertical"
                  placeholder="Describe what students will learn in this course"
                  required
                />
              </div>

              {/* Level Field */}
              <div>
                <label htmlFor="level" className="block text-sm font-semibold text-gray-700 mb-2">
                  Course Level *
                </label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value={CourseLevel.BEGINNER}>Beginner</option>
                  <option value={CourseLevel.INTERMEDIATE}>Intermediate</option>
                  <option value={CourseLevel.ADVANCED}>Advanced</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">
                  Choose the appropriate difficulty level for your course
                </p>
              </div>

              {/* Error Message */}
              {submitError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p className="text-red-700 font-medium">{submitError}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2 ${
                    isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Updating Course...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Update Course</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel</span>
                </button>
              </div>
            </form>
          </div>

          {/* Course Preview */}
          <div className="card p-8 mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <span>👁️</span>
              <span>Preview</span>
            </h2>
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {formData.title || 'Course Title'}
              </h3>
              <div className="flex items-center space-x-2 mb-4">
                <span className={`badge ${
                  formData.level === CourseLevel.BEGINNER ? 'badge-green' :
                  formData.level === CourseLevel.INTERMEDIATE ? 'badge-yellow' : 'badge-red'
                } text-xs font-bold`}>
                  {formData.level} LEVEL
                </span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {formData.description || 'Course description will appear here...'}
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </ProtectedRoute>
  );
};

export default EditCoursePage;