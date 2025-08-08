export enum CourseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
}

export enum EnrollmentRole {
  STUDENT = 'STUDENT',
  PROFESSOR = 'PROFESSOR',
}

export interface User {
  id: string;
  name: string;
  email: string;
  enrollments: Enrollment[];
  createdAt: string;
  updatedAt: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  level: CourseLevel;
  enrollments: Enrollment[];
  createdAt: string;
  updatedAt: string;
  userEnrollment?: Enrollment;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  role: EnrollmentRole;
  enrolledAt: string;
  user: User;
  course: Course;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface CourseInput {
  title: string;
  description: string;
  level: CourseLevel;
}

export interface UpdateCourseInput {
  title?: string;
  description?: string;
  level?: CourseLevel;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface CourseCardProps {
  course: Course;
  showEnrollButton?: boolean;
}

export interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}