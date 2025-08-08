const { gql } = require('apollo-server-express');

const typeDefs = gql`
  enum CourseLevel {
    BEGINNER
    INTERMEDIATE
    ADVANCED
  }

  enum EnrollmentRole {
    STUDENT
    PROFESSOR
  }

  type User {
    id: ID!
    name: String!
    email: String!
    enrollments: [Enrollment!]!
    createdAt: String!
    updatedAt: String!
  }

  type Course {
    id: ID!
    title: String!
    description: String!
    level: CourseLevel!
    enrollments: [Enrollment!]!
    createdAt: String!
    updatedAt: String!
    userEnrollment: Enrollment
  }

  type Enrollment {
    id: ID!
    userId: String!
    courseId: String!
    role: EnrollmentRole!
    enrolledAt: String!
    user: User!
    course: Course!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input CourseInput {
    title: String!
    description: String!
    level: CourseLevel!
  }

  input UpdateCourseInput {
    title: String
    description: String
    level: CourseLevel
  }

  type Query {
    # Course queries
    courses: [Course!]!
    course(id: ID!): Course
    
    # User queries
    me: User
    myEnrollments: [Enrollment!]!
    
    # Check if user can edit course
    canEditCourse(courseId: ID!): Boolean!
  }

  type Mutation {
    # Authentication
    login(email: String!, password: String!): AuthPayload!
    
    # Course management
    createCourse(input: CourseInput!): Course!
    updateCourse(id: ID!, input: UpdateCourseInput!): Course!
    
    # Enrollment
    enrollInCourse(courseId: ID!, role: EnrollmentRole = STUDENT): Enrollment!
    unenrollFromCourse(courseId: ID!): Boolean!
  }
`;

module.exports = typeDefs;