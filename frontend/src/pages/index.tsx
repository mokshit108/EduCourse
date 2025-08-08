import React, { useState } from 'react';
import { useQuery } from '@apollo/client';
import Layout from '../components/Layout';
import CourseCard from '../components/CourseCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import { GET_COURSES } from '../graphql/queries';
import { Course, CourseLevel } from '../types';

const HomePage: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(GET_COURSES);
  const [levelFilter, setLevelFilter] = useState<CourseLevel | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  if (loading) {
    return (
      <Layout title="Courses - EdTech Platform">
        <LoadingSpinner 
          size="large" 
          message="Loading amazing courses..." 
          fullScreen={false}
        />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout title="Courses - EdTech Platform">
        <ErrorMessage
          title="Error Loading Courses"
          message={error.message || "Failed to load courses. Please try again."}
          onRetry={() => refetch()}
          fullScreen={false}
        />
      </Layout>
    );
  }

  const courses: Course[] = data?.courses || [];

  // Filter courses based on search term and level
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'ALL' || course.level === levelFilter;
    return matchesSearch && matchesLevel;
  });

  const levelCounts = courses.reduce((acc, course) => {
    acc[course.level] = (acc[course.level] || 0) + 1;
    return acc;
  }, {} as Record<CourseLevel, number>);

  return (
    <Layout title="Courses - EdTech Platform">
      {/* Hero Section */}
      <div className="text-center mb-16 animate-fadeIn">
        <div className="mb-8">
          <div className="text-6xl mb-4 animate-float">🎓</div>
          <h1 className="text-5xl font-bold text-gradient mb-6">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover a wide range of courses designed to help you learn new skills and advance your career.
            From beginner to advanced levels, we have something for everyone in our learning community.
          </p>
        </div>
        
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto">
          <div className="card-gradient p-4">
            <div className="text-2xl font-bold text-blue-600">{courses.length}</div>
            <div className="text-sm text-gray-600">Available Courses</div>
          </div>
          <div className="card-gradient p-4">
            <div className="text-2xl font-bold text-purple-600">
              {new Set(courses.flatMap(course => 
                course.enrollments?.filter(e => e.role === 'PROFESSOR').map(e => e.user.id) || []
              )).size}
            </div>
            <div className="text-sm text-gray-600">Expert Instructors</div>
          </div>
          <div className="card-gradient p-4">
            <div className="text-2xl font-bold text-green-600">
              {courses.reduce((sum, course) => sum + (course.enrollments?.length || 0), 0)}
            </div>
            <div className="text-sm text-gray-600">Total Enrollments</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Section */}
      <div className="card-gradient p-8 mb-12 animate-slideInUp">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Search Input */}
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-semibold text-gray-700 mb-3">
              🔍 Search Courses
            </label>
            <div className="relative">
              <input
                type="text"
                id="search"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-12"
              />
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Level Filter */}
          <div className="lg:w-80">
            <label htmlFor="level" className="block text-sm font-semibold text-gray-700 mb-3">
              📊 Filter by Level
            </label>
            <select
              id="level"
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value as CourseLevel | 'ALL')}
              className="input-field"
            >
              <option value="ALL">All Levels ({courses.length})</option>
              <option value={CourseLevel.BEGINNER}>
                🟢 Beginner ({levelCounts[CourseLevel.BEGINNER] || 0})
              </option>
              <option value={CourseLevel.INTERMEDIATE}>
                🟡 Intermediate ({levelCounts[CourseLevel.INTERMEDIATE] || 0})
              </option>
              <option value={CourseLevel.ADVANCED}>
                🔴 Advanced ({levelCounts[CourseLevel.ADVANCED] || 0})
              </option>
            </select>
          </div>
        </div>

        {/* Results Count */}
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold text-blue-600">{filteredCourses.length}</span> of <span className="font-semibold">{courses.length}</span> courses
          </div>
          {(searchTerm || levelFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('ALL');
              }}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Courses Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredCourses.map((course, index) => (
            <div key={course.id} style={{ animationDelay: `${index * 0.1}s` }}>
              <CourseCard course={course} />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 animate-fadeIn">
          <div className="text-8xl text-gray-300 mb-6">📚</div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            No courses found
          </h3>
          <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
            {searchTerm || levelFilter !== 'ALL'
              ? 'Try adjusting your search or filter criteria to find the perfect course for you.'
              : 'No courses are available at the moment. Check back soon for new learning opportunities!'}
          </p>
          {(searchTerm || levelFilter !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setLevelFilter('ALL');
              }}
              className="btn-primary"
            >
              Show All Courses
            </button>
          )}
        </div>
      )}

      {/* Call to Action Section */}
      {courses.length > 0 && (
        <div className="mt-20 relative overflow-hidden">
          <div className="card bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white p-12 text-center">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 to-purple-600/90"></div>
            <div className="relative z-10">
              <div className="text-5xl mb-6 animate-float">🚀</div>
              <h2 className="text-4xl font-bold mb-6">Ready to Start Learning?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of learners who are already advancing their careers with our expert-led courses.
                Start your learning journey today!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">{courses.length}</div>
                  <div className="text-blue-200">Quality Courses</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {courses.reduce((sum, course) => sum + (course.enrollments?.length || 0), 0)}
                  </div>
                  <div className="text-blue-200">Happy Students</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold mb-2">
                    {new Set(courses.flatMap(course => 
                      course.enrollments?.filter(e => e.role === 'PROFESSOR').map(e => e.user.id) || []
                    )).size}
                  </div>
                  <div className="text-blue-200">Expert Instructors</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;