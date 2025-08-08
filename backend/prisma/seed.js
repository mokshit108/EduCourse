const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);
  
  const john = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      name: 'John Doe',
      email: 'john@example.com',
      password: hashedPassword,
    },
  });

  const jane = await prisma.user.upsert({
    where: { email: 'jane@example.com' },
    update: {},
    create: {
      name: 'Jane Smith',
      email: 'jane@example.com',
      password: hashedPassword,
    },
  });

  const professor = await prisma.user.upsert({
    where: { email: 'prof@example.com' },
    update: {},
    create: {
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
  await prisma.enrollment.createMany({
    data: [
      {
        userId: john.id,
        courseId: reactCourse.id,
        role: 'STUDENT',
      },
      {
        userId: jane.id,
        courseId: reactCourse.id,
        role: 'STUDENT',
      },
      {
        userId: professor.id,
        courseId: reactCourse.id,
        role: 'PROFESSOR',
      },
      {
        userId: professor.id,
        courseId: nodeCourse.id,
        role: 'PROFESSOR',
      },
      {
        userId: john.id,
        courseId: graphqlCourse.id,
        role: 'STUDENT',
      },
      {
        userId: professor.id,
        courseId: pythonCourse.id,
        role: 'PROFESSOR',
      },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Database seeded successfully!');
  console.log('\n👥 Users created:');
  console.log('📧 john@example.com (password: password123)');
  console.log('📧 jane@example.com (password: password123)');
  console.log('📧 prof@example.com (password: password123)');
  console.log('\n📚 Courses created: 5 courses');
  console.log('🎓 Enrollments created: 6 enrollments');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });