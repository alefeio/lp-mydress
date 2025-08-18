// backup.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs/promises');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando o backup...');

    const backupData = {
      banners: await prisma.banner.findMany(),
      faqs: await prisma.fAQ.findMany(),
      homepageSections: await prisma.homepageSection.findMany(),
      menus: await prisma.menu.findMany(),
      testimonials: await prisma.testimonial.findMany(),
      users: await prisma.user.findMany(),
    };

    const backupPath = path.join(__dirname, 'db_backup.json');
    await fs.writeFile(backupPath, JSON.stringify(backupData, null, 2));

    console.log(`Backup concluído com sucesso! Os dados foram salvos em ${backupPath}`);
  } catch (error) {
    console.error('Erro ao realizar o backup:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();