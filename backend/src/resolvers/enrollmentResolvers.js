const { PrismaClient } = require('@prisma/client');
const { requireAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

const enrollmentResolvers = {
  Mutation: {
    enrollInCourse: async (parent, { courseId, role }, { user }) => {
      requireAuth(user);

      // Check if course exists
      const course = await prisma.course.findUnique({
        where: { id: courseId },
      });

      if (!course) {
        throw new Error('Course not found');
      }

      // Check if user is already enrolled
      const existingEnrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId,
        },
      });

      if (existingEnrollment) {
        throw new Error('You are already enrolled in this course');
      }

      // Create enrollment
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: user.id,
          courseId,
          role,
        },
        include: {
          user: true,
          course: true,
        },
      });

      return enrollment;
    },

    unenrollFromCourse: async (parent, { courseId }, { user }) => {
      requireAuth(user);

      // Check if enrollment exists
      const enrollment = await prisma.enrollment.findFirst({
        where: {
          userId: user.id,
          courseId,
        },
      });

      if (!enrollment) {
        throw new Error('You are not enrolled in this course');
      }

      // Prevent professors from unenrolling if they're the only professor
      if (enrollment.role === 'PROFESSOR') {
        const professorCount = await prisma.enrollment.count({
          where: {
            courseId,
            role: 'PROFESSOR',
          },
        });

        if (professorCount === 1) {
          throw new Error('Cannot unenroll: You are the only professor for this course');
        }
      }

      // Delete enrollment
      await prisma.enrollment.delete({
        where: { id: enrollment.id },
      });

      return true;
    },
  },

  Enrollment: {
    user: async (parent) => {
      return await prisma.user.findUnique({
        where: { id: parent.userId },
      });
    },

    course: async (parent) => {
      return await prisma.course.findUnique({
        where: { id: parent.courseId },
      });
    },
  },
};

module.exports = enrollmentResolvers;