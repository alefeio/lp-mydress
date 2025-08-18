// restore.js

const { PrismaClient } = require('@prisma/client');
const fs = require('fs/promises');
const path = require('path');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Iniciando a restauração...');
    
    const backupPath = path.join(__dirname, 'db_backup.json');
    const backupFile = await fs.readFile(backupPath, 'utf-8');
    const backupData = JSON.parse(backupFile);

    // Ordem de restauração para respeitar as dependências de chaves estrangeiras
    // (Por exemplo, User deve ser restaurado antes de Account, que não tem registros)
    
    // Apaga os dados existentes para uma restauração limpa
    await prisma.testimonial.deleteMany({});
    await prisma.fAQ.deleteMany({});
    await prisma.homepageSection.deleteMany({});
    await prisma.menu.deleteMany({});
    await prisma.banner.deleteMany({});
    await prisma.user.deleteMany({});
    
    // Restaura os dados
    if (backupData.users && backupData.users.length > 0) {
      await prisma.user.createMany({ data: backupData.users });
      console.log('Dados da tabela User restaurados.');
    }

    if (backupData.testimonials && backupData.testimonials.length > 0) {
      await prisma.testimonial.createMany({ data: backupData.testimonials });
      console.log('Dados da tabela Testimonial restaurados.');
    }

    if (backupData.faqs && backupData.faqs.length > 0) {
      await prisma.fAQ.createMany({ data: backupData.faqs });
      console.log('Dados da tabela FAQ restaurados.');
    }

    if (backupData.homepageSections && backupData.homepageSections.length > 0) {
      await prisma.homepageSection.createMany({ data: backupData.homepageSections });
      console.log('Dados da tabela HomepageSection restaurados.');
    }

    if (backupData.menus && backupData.menus.length > 0) {
      await prisma.menu.createMany({ data: backupData.menus });
      console.log('Dados da tabela Menu restaurados.');
    }

    if (backupData.banners && backupData.banners.length > 0) {
      await prisma.banner.createMany({ data: backupData.banners });
      console.log('Dados da tabela Banner restaurados.');
    }

    console.log('Restauração concluída com sucesso!');
  } catch (error) {
    console.error('Erro ao realizar a restauração:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();