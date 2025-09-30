import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create 3 Users
  const user1 = await prisma.user.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      role: 'admin',
      passwordHash: 'hashedpassword123',
    },
  });

  const user2 = await prisma.user.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      role: 'developer',
      passwordHash: 'hashedpassword456',
    },
  });

  const user3 = await prisma.user.create({
    data: {
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      role: 'designer',
      passwordHash: 'hashedpassword789',
    },
  });

  console.log('✅ Users created');

  // Create 3 Projects
  const project1 = await prisma.project.create({
    data: {
      name: 'E-commerce Platform',
      description: 'Building a modern e-commerce platform',
      createdBy: user1.id,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }, { id: user3.id }]
      }
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App',
      description: 'Cross-platform mobile application',
      createdBy: user2.id,
      members: {
        connect: [{ id: user1.id }, { id: user2.id }]
      }
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'Company Website',
      description: 'Corporate website redesign',
      createdBy: user3.id,
      members: {
        connect: [{ id: user2.id }, { id: user3.id }]
      }
    },
  });

  console.log('✅ Projects created');

  // Create 5 Tasks
  const tasks = [
    {
      title: 'Setup Authentication System',
      description: 'Implement JWT-based authentication',
      status: 'in_progress',
      priority: 'high',
      assigneeId: user1.id,
      projectId: project1.id,
      dueDate: new Date('2025-10-15'),
    },
    {
      title: 'Design Product Catalog UI',
      description: 'Create wireframes and mockups for product pages',
      status: 'todo',
      priority: 'medium',
      assigneeId: user3.id,
      projectId: project1.id,
      dueDate: new Date('2025-10-20'),
    },
    {
      title: 'Implement Payment Gateway',
      description: 'Integrate Stripe payment processing',
      status: 'todo',
      priority: 'high',
      assigneeId: user2.id,
      projectId: project1.id,
      dueDate: new Date('2025-11-01'),
    },
    {
      title: 'Create User Onboarding Flow',
      description: 'Design and implement user registration process',
      status: 'completed',
      priority: 'medium',
      assigneeId: user2.id,
      projectId: project2.id,
      dueDate: new Date('2025-09-30'),
    },
    {
      title: 'Optimize Homepage Performance',
      description: 'Improve loading times and SEO optimization',
      status: 'in_progress',
      priority: 'low',
      assigneeId: user3.id,
      projectId: project3.id,
      dueDate: new Date('2025-10-10'),
    },
  ];

  for (const taskData of tasks) {
    await prisma.task.create({ data: taskData });
  }

  console.log('✅ Tasks created');

  // Create some sample messages
  await prisma.message.create({
    data: {
      content: 'Welcome to the E-commerce project! Let\'s build something amazing.',
      senderId: user1.id,
      projectId: project1.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'I\'ve started working on the authentication system.',
      senderId: user1.id,
      projectId: project1.id,
    },
  });

  await prisma.message.create({
    data: {
      content: 'Mobile app wireframes are ready for review.',
      senderId: user2.id,
      projectId: project2.id,
    },
  });

  console.log('✅ Messages created');
  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });