import { gql } from '@apollo/client';

// User Queries
export const LOGIN_MUTATION = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        enrollments {
          id
          role
          course {
            id
            title
          }
        }
      }
    }
  }
`;

export const GET_ME = gql`
  query GetMe {
    me {
      id
      name
      email
      enrollments {
        id
        role
        enrolledAt
        course {
          id
          title
          level
        }
      }
    }
  }
`;

export const GET_MY_ENROLLMENTS = gql`
  query GetMyEnrollments {
    myEnrollments {
      id
      role
      enrolledAt
      course {
        id
        title
        description
        level
      }
      user {
        id
        name
        email
      }
    }
  }
`;

// Course Queries
export const GET_COURSES = gql`
  query GetCourses {
    courses {
      id
      title
      description
      level
      createdAt
      userEnrollment {
        id
        role
      }
      enrollments {
        id
        role
        user {
          name
        }
      }
    }
  }
`;

export const GET_COURSE = gql`
  query GetCourse($id: ID!) {
    course(id: $id) {
      id
      title
      description
      level
      createdAt
      updatedAt
      userEnrollment {
        id
        role
        enrolledAt
      }
      enrollments {
        id
        role
        enrolledAt
        user {
          id
          name
          email
        }
      }
    }
  }
`;

export const CAN_EDIT_COURSE = gql`
  query CanEditCourse($courseId: ID!) {
    canEditCourse(courseId: $courseId)
  }
`;

// Course Mutations
export const CREATE_COURSE = gql`
  mutation CreateCourse($input: CourseInput!) {
    createCourse(input: $input) {
      id
      title
      description
      level
      createdAt
    }
  }
`;

export const UPDATE_COURSE = gql`
  mutation UpdateCourse($id: ID!, $input: UpdateCourseInput!) {
    updateCourse(id: $id, input: $input) {
      id
      title
      description
      level
      updatedAt
    }
  }
`;

// Enrollment Mutations
export const ENROLL_IN_COURSE = gql`
  mutation EnrollInCourse($courseId: ID!, $role: EnrollmentRole = STUDENT) {
    enrollInCourse(courseId: $courseId, role: $role) {
      id
      role
      enrolledAt
      course {
        id
        title
      }
      user {
        id
        name
      }
    }
  }
`;

export const UNENROLL_FROM_COURSE = gql`
  mutation UnenrollFromCourse($courseId: ID!) {
    unenrollFromCourse(courseId: $courseId)
  }
`;

// Fragments for reusability
export const COURSE_FRAGMENT = gql`
  fragment CourseInfo on Course {
    id
    title
    description
    level
    createdAt
    updatedAt
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserInfo on User {
    id
    name
    email
  }
`;

export const ENROLLMENT_FRAGMENT = gql`
  fragment EnrollmentInfo on Enrollment {
    id
    role
    enrolledAt
  }
`;