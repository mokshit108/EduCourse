-- CreateTable
CREATE TABLE IF NOT EXISTS "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "courses" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "level" "CourseLevel" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE IF NOT EXISTS "enrollments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "role" "EnrollmentRole" NOT NULL,
    "enrolledAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "enrollments_pkey" PRIMARY KEY ("id")
);

-- CreateEnum
DO $$ BEGIN
 CREATE TYPE "CourseLevel" AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- CreateEnum
DO $$ BEGIN
 CREATE TYPE "EnrollmentRole" AS ENUM ('STUDENT', 'PROFESSOR');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "enrollments_userId_courseId_key" ON "enrollments"("userId", "courseId");

-- AddForeignKey
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- AddForeignKey
DO $$ BEGIN
 ALTER TABLE "enrollments" ADD CONSTRAINT "enrollments_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

-- Seed Demo Users (password: password123, hashed with bcrypt rounds=12)
INSERT INTO "users" ("id", "name", "email", "password", "createdAt", "updatedAt") VALUES 
('demo-user-john', 'John Doe', 'john@example.com', '$2b$12$JoljfqJ7jZ8xoJU42N/eM.SlBWRGBrJAQetujP1sMld8e/P9d3os.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-user-jane', 'Jane Smith', 'jane@example.com', '$2b$12$JoljfqJ7jZ8xoJU42N/eM.SlBWRGBrJAQetujP1sMld8e/P9d3os.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('demo-user-prof', 'Prof. Wilson', 'prof@example.com', '$2b$12$JoljfqJ7jZ8xoJU42N/eM.SlBWRGBrJAQetujP1sMld8e/P9d3os.', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("email") DO NOTHING;

-- Seed Demo Courses
INSERT INTO "courses" ("id", "title", "description", "level", "createdAt", "updatedAt") VALUES 
('react-basics', 'React Fundamentals', 'Learn the basics of React including components, props, state, and hooks. Perfect for beginners who want to start their journey in modern web development.', 'BEGINNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('node-advanced', 'Advanced Node.js', 'Deep dive into Node.js with advanced concepts like streams, clusters, microservices, and performance optimization.', 'ADVANCED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('graphql-intro', 'GraphQL Introduction', 'Master GraphQL from scratch. Learn queries, mutations, subscriptions, and how to build efficient APIs.', 'INTERMEDIATE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('python-basics', 'Python for Beginners', 'Start your programming journey with Python. Learn syntax, data structures, and basic programming concepts.', 'BEGINNER', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ai-fundamentals', 'AI & Machine Learning', 'Explore the world of artificial intelligence and machine learning with practical examples and real-world applications.', 'ADVANCED', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT ("id") DO NOTHING;

-- Seed Demo Enrollments
INSERT INTO "enrollments" ("id", "userId", "courseId", "role", "enrolledAt") VALUES 
('enroll-john-react', 'demo-user-john', 'react-basics', 'STUDENT', CURRENT_TIMESTAMP),
('enroll-jane-react', 'demo-user-jane', 'react-basics', 'STUDENT', CURRENT_TIMESTAMP),
('enroll-prof-react', 'demo-user-prof', 'react-basics', 'PROFESSOR', CURRENT_TIMESTAMP),
('enroll-prof-node', 'demo-user-prof', 'node-advanced', 'PROFESSOR', CURRENT_TIMESTAMP),
('enroll-john-graphql', 'demo-user-john', 'graphql-intro', 'STUDENT', CURRENT_TIMESTAMP),
('enroll-prof-python', 'demo-user-prof', 'python-basics', 'PROFESSOR', CURRENT_TIMESTAMP)
ON CONFLICT ("userId", "courseId") DO NOTHING;