const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const getUser = async (req) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        enrollments: {
          include: {
            course: true,
          },
        },
      },
    });
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
};

const requireAuth = (user) => {
  if (!user) {
    throw new Error('Authentication required');
  }
  return user;
};

const checkCoursePermission = async (userId, courseId, requiredRole = 'PROFESSOR') => {
  const enrollment = await prisma.enrollment.findFirst({
    where: {
      userId,
      courseId,
      role: requiredRole,
    },
  });
  
  return !!enrollment;
};

module.exports = {
  getUser,
  requireAuth,
  checkCoursePermission,
};