import React from 'react';
import Link from 'next/link';
import { Course, CourseLevel, EnrollmentRole } from '../types';
import { useAuth } from '../context/AuthContext';

interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, showEnrollButton = true }) => {
  const { user } = useAuth();

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

  const getRoleColor = (role: EnrollmentRole) => {
    return role === EnrollmentRole.PROFESSOR
      ? 'badge-purple'
      : 'badge-blue';
  };

  const isEnrolled = !!course.userEnrollment;
  const userRole = course.userEnrollment?.role;
  const enrollmentCount = course.enrollments?.length || 0;
  const professorCount = course.enrollments?.filter(e => e.role === EnrollmentRole.PROFESSOR).length || 0;
  const studentCount = course.enrollments?.filter(e => e.role === EnrollmentRole.STUDENT).length || 0;

  return (
    <div className="card group animate-fadeIn">
      {/* Course Image Placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-6xl text-white/80 group-hover:scale-110 transition-transform duration-300">
            📚
          </div>
        </div>
        
        {/* Level Badge */}
        <div className="absolute top-4 left-4">
          <span className={`${getLevelColor(course.level)} text-xs font-bold uppercase tracking-wide`}>
            {course.level}
          </span>
        </div>
        
        {/* Enrollment Status */}
        {isEnrolled && userRole && (
          <div className="absolute top-4 right-4">
            <span className={`${getRoleColor(userRole)} text-xs font-bold`}>
              {userRole === EnrollmentRole.PROFESSOR ? '👨‍🏫 Professor' : '👨‍🎓 Student'}
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        {/* Course Header */}
        <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200">
            {course.title}
          </h3>
          
          {/* Course Description */}
          <p className="text-gray-600 line-clamp-3 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Course Stats */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <span className="text-blue-500">👥</span>
              <span className="font-medium">{enrollmentCount}</span>
              <span>enrolled</span>
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-green-500">📅</span>
              <span>{new Date(course.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <Link
            href={`/course/${course.id}`}
            className="group flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
          >
            <span>View Details</span>
            <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>

          {user && showEnrollButton && (
            <div className="flex items-center space-x-2">
              {isEnrolled ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-semibold">Enrolled</span>
                  </div>
                  {userRole === EnrollmentRole.PROFESSOR && (
                    <Link
                      href={`/course/${course.id}/edit`}
                      className="px-3 py-1 bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white text-sm font-semibold rounded-lg transition-all duration-200 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              ) : (
                <Link
                  href={`/course/${course.id}`}
                  className="btn-primary text-sm px-4 py-2"
                >
                  Enroll Now
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Enrollment Preview */}
      {course.enrollments && course.enrollments.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-1 text-purple-600">
              <span className="font-semibold">{professorCount}</span>
              <span>Instructor{professorCount !== 1 ? 's' : ''}</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center space-x-1 text-blue-600">
              <span className="font-semibold">{studentCount}</span>
              <span>Student{studentCount !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseCard;