const { PrismaClient } = require('@prisma/client');
const { requireAuth, checkCoursePermission } = require('../middleware/auth');

const prisma = new PrismaClient();

const courseResolvers = {
  Query: {
    courses: async (parent, args, { user }) => {
      const courses = await prisma.course.findMany({
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      // If user is authenticated, add their enrollment info to each course
      if (user) {
        return courses.map(course => ({
          ...course,
          userEnrollment: course.enrollments.find(e => e.userId === user.id),
        }));
      }

      return courses;
    },

    course: async (parent, { id }, { user }) => {
      const course = await prisma.course.findUnique({
        where: { id },
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      if (!course) {
        throw new Error('Course not found');
      }

      // If user is authenticated, add their enrollment info
      if (user) {
        const userEnrollment = course.enrollments.find(e => e.userId === user.id);
        return {
          ...course,
          userEnrollment,
        };
      }

      return course;
    },

    canEditCourse: async (parent, { courseId }, { user }) => {
      if (!user) return false;
      return await checkCoursePermission(user.id, courseId, 'PROFESSOR');
    },
  },

  Mutation: {
    createCourse: async (parent, { input }, { user }) => {
      requireAuth(user);

      const course = await prisma.course.create({
        data: {
          ...input,
          enrollments: {
            create: {
              userId: user.id,
              role: 'PROFESSOR',
            },
          },
        },
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      return course;
    },

    updateCourse: async (parent, { id, input }, { user }) => {
      requireAuth(user);

      // Check if user has permission to edit this course
      const hasPermission = await checkCoursePermission(user.id, id, 'PROFESSOR');
      if (!hasPermission) {
        throw new Error('You do not have permission to edit this course');
      }

      const course = await prisma.course.update({
        where: { id },
        data: input,
        include: {
          enrollments: {
            include: {
              user: true,
            },
          },
        },
      });

      return course;
    },
  },

  Course: {
    enrollments: async (parent) => {
      return await prisma.enrollment.findMany({
        where: { courseId: parent.id },
        include: {
          user: true,
          course: true,
        },
      });
    },
  },
};

module.exports = courseResolvers;