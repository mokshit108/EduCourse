import { User, EnrollmentRole } from '../types';

/**
 * Check if user has a specific role in a course
 */
export const hasRoleInCourse = (
  user: User | null,
  courseId: string,
  role: EnrollmentRole
): boolean => {
  if (!user || !user.enrollments) return false;
  
  return user.enrollments.some(
    enrollment => 
      enrollment.course.id === courseId && 
      enrollment.role === role
  );
};

/**
 * Check if user is enrolled in a course (any role)
 */
export const isEnrolledInCourse = (
  user: User | null,
  courseId: string
): boolean => {
  if (!user || !user.enrollments) return false;
  
  return user.enrollments.some(
    enrollment => enrollment.course.id === courseId
  );
};

/**
 * Get user's role in a specific course
 */
export const getUserRoleInCourse = (
  user: User | null,
  courseId: string
): EnrollmentRole | null => {
  if (!user || !user.enrollments) return null;
  
  const enrollment = user.enrollments.find(
    enrollment => enrollment.course.id === courseId
  );
  
  return enrollment ? enrollment.role : null;
};

/**
 * Check if user is a professor in any course
 */
export const isProfessor = (user: User | null): boolean => {
  if (!user || !user.enrollments) return false;
  
  return user.enrollments.some(
    enrollment => enrollment.role === EnrollmentRole.PROFESSOR
  );
};

/**
 * Get all courses where user is a professor
 */
export const getProfessorCourses = (user: User | null): string[] => {
  if (!user || !user.enrollments) return [];
  
  return user.enrollments
    .filter(enrollment => enrollment.role === EnrollmentRole.PROFESSOR)
    .map(enrollment => enrollment.course.id);
};

/**
 * Get all courses where user is a student
 */
export const getStudentCourses = (user: User | null): string[] => {
  if (!user || !user.enrollments) return [];
  
  return user.enrollments
    .filter(enrollment => enrollment.role === EnrollmentRole.STUDENT)
    .map(enrollment => enrollment.course.id);
};