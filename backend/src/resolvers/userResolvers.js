const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middleware/auth');

const prisma = new PrismaClient();

const userResolvers = {
  Query: {
    me: async (parent, args, { user }) => {
      requireAuth(user);
      return user;
    },

    myEnrollments: async (parent, args, { user }) => {
      requireAuth(user);

      return await prisma.enrollment.findMany({
        where: { userId: user.id },
        include: {
          course: true,
          user: true,
        },
        orderBy: {
          enrolledAt: 'desc',
        },
      });
    },
  },

  Mutation: {
    login: async (parent, { email, password }) => {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          enrollments: {
            include: {
              course: true,
            },
          },
        },
      });

      if (!user) {
        throw new Error('Invalid email or password');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      const token = jwt.sign(
        { userId: user.id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      return {
        token,
        user: userWithoutPassword,
      };
    },
  },

  User: {
    enrollments: async (parent) => {
      return await prisma.enrollment.findMany({
        where: { userId: parent.id },
        include: {
          course: true,
          user: true,
        },
      });
    },
  },
};

module.exports = userResolvers;