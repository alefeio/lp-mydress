const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function backup() {
  try {
    // Tabela: Banner (1 registro)
    const banners = await prisma.banner.findMany();
    fs.writeFileSync('banners_backup.json', JSON.stringify(banners, null, 2));
    console.log('Backup de Banners criado com sucesso em banners_backup.json');

    // Tabela: HomepageSection (1 registro)
    const homepageSections = await prisma.homepageSection.findMany();
    fs.writeFileSync('homepageSection_backup.json', JSON.stringify(homepageSections, null, 2));
    console.log('Backup de HomepageSection criado com sucesso em homepageSection_backup.json');
    
    // Tabela: Menu (1 registro)
    const menus = await prisma.menu.findMany();
    fs.writeFileSync('menus_backup.json', JSON.stringify(menus, null, 2));
    console.log('Backup de Menus criado com sucesso em menus_backup.json');

    // Tabela: Testimonial (9 registros)
    const testimonials = await prisma.testimonial.findMany();
    fs.writeFileSync('testimonials_backup.json', JSON.stringify(testimonials, null, 2));
    console.log('Backup de Depoimentos criado com sucesso em testimonials_backup.json');

    // Tabela: User (1 registro)
    const users = await prisma.user.findMany();
    fs.writeFileSync('users_backup.json', JSON.stringify(users, null, 2));
    console.log('Backup de Usuários criado com sucesso em users_backup.json');

    console.log('\nTodos os backups com registros foram concluídos!');

  } catch (error) {
    console.error("Erro ao fazer o backup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

backup();