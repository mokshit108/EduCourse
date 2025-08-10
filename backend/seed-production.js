const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedProduction() {
  console.log('🌱 Seeding production database...');

  try {
    // Create users with the correct bcrypt hash for 'password123'
    const hashedPassword = '$2b$12$JoljfqJ7jZ8xoJU42N/eM.SlBWRGBrJAQetujP1sMld8e/P9d3os.';
    
    const john = await prisma.user.upsert({
      where: { email: 'john@example.com' },
      update: {},
      create: {
        id: 'demo-user-john',
        name: 'John Doe',
        email: 'john@example.com',
        password: hashedPassword,
      },
    });

    const jane = await prisma.user.upsert({
      where: { email: 'jane@example.com' },
      update: {},
      create: {
        id: 'demo-user-jane',
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: hashedPassword,
      },
    });

    const professor = await prisma.user.upsert({
      where: { email: 'prof@example.com' },
      update: {},
      create: {
        id: 'demo-user-prof',
        name: 'Prof. Wilson',
        email: 'prof@example.com',
        password: hashedPassword,
      },
    });

    // Create courses
    const reactCourse = await prisma.course.upsert({
      where: { id: 'react-basics' },
      update: {},
      create: {
        id: 'react-basics',
        title: 'React Fundamentals',
        description: 'Learn the basics of React including components, props, state, and hooks. Perfect for beginners who want to start their journey in modern web development.',
        level: 'BEGINNER',
      },
    });

    const nodeCourse = await prisma.course.upsert({
      where: { id: 'node-advanced' },
      update: {},
      create: {
        id: 'node-advanced',
        title: 'Advanced Node.js',
        description: 'Deep dive into Node.js with advanced concepts like streams, clusters, microservices, and performance optimization.',
        level: 'ADVANCED',
      },
    });

    const graphqlCourse = await prisma.course.upsert({
      where: { id: 'graphql-intro' },
      update: {},
      create: {
        id: 'graphql-intro',
        title: 'GraphQL Introduction',
        description: 'Master GraphQL from scratch. Learn queries, mutations, subscriptions, and how to build efficient APIs.',
        level: 'INTERMEDIATE',
      },
    });

    const pythonCourse = await prisma.course.upsert({
      where: { id: 'python-basics' },
      update: {},
      create: {
        id: 'python-basics',
        title: 'Python for Beginners',
        description: 'Start your programming journey with Python. Learn syntax, data structures, and basic programming concepts.',
        level: 'BEGINNER',
      },
    });

    const aiCourse = await prisma.course.upsert({
      where: { id: 'ai-fundamentals' },
      update: {},
      create: {
        id: 'ai-fundamentals',
        title: 'AI & Machine Learning',
        description: 'Explore the world of artificial intelligence and machine learning with practical examples and real-world applications.',
        level: 'ADVANCED',
      },
    });

    // Create enrollments
    const enrollments = [
      {
        id: 'enroll-john-react',
        userId: john.id,
        courseId: reactCourse.id,
        role: 'STUDENT',
      },
      {
        id: 'enroll-jane-react',
        userId: jane.id,
        courseId: reactCourse.id,
        role: 'STUDENT',
      },
      {
        id: 'enroll-prof-react',
        userId: professor.id,
        courseId: reactCourse.id,
        role: 'PROFESSOR',
      },
      {
        id: 'enroll-prof-node',
        userId: professor.id,
        courseId: nodeCourse.id,
        role: 'PROFESSOR',
      },
      {
        id: 'enroll-john-graphql',
        userId: john.id,
        courseId: graphqlCourse.id,
        role: 'STUDENT',
      },
      {
        id: 'enroll-prof-python',
        userId: professor.id,
        courseId: pythonCourse.id,
        role: 'PROFESSOR',
      },
    ];

    for (const enrollment of enrollments) {
      try {
        await prisma.enrollment.upsert({
          where: { 
            userId_courseId: {
              userId: enrollment.userId,
              courseId: enrollment.courseId
            }
          },
          update: {},
          create: enrollment,
        });
      } catch (error) {
        console.log(`Enrollment already exists: ${enrollment.userId} -> ${enrollment.courseId}`);
      }
    }

    console.log('✅ Production database seeded successfully!');
    console.log('\n👥 Demo Users Available:');
    console.log('📧 john@example.com (password: password123)');
    console.log('📧 jane@example.com (password: password123)');
    console.log('📧 prof@example.com (password: password123)');
    console.log('\n📚 Courses created: 5 courses');
    console.log('🎓 Enrollments created: 6 enrollments');

  } catch (error) {
    console.error('❌ Error seeding production database:', error);
    throw error;
  }
}

seedProduction()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });