const { PrismaClient } = require('@prisma/client');
const fs = require('fs');

const prisma = new PrismaClient();

async function restore() {
  try {
    console.log('Iniciando a restauração dos dados...');

    // 1. Restaura os usuários
    console.log('Restaurando a tabela User...');
    const usersData = JSON.parse(fs.readFileSync('users_backup.json', 'utf8'));
    for (const user of usersData) {
      await prisma.user.create({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          emailVerified: new Date(user.emailVerified),
          image: user.image,
          role: user.role
        }
      });
    }
    console.log('Tabela User restaurada com sucesso!');

    // 2. Restaura o menu
    console.log('Restaurando a tabela Menu...');
    const menusData = JSON.parse(fs.readFileSync('menus_backup.json', 'utf8'));
    for (const menu of menusData) {
        await prisma.menu.create({
            data: {
                id: menu.id,
                logoUrl: menu.logoUrl,
                links: menu.links
            }
        });
    }
    console.log('Tabela Menu restaurada com sucesso!');

    // 3. Restaura os banners
    console.log('Restaurando a tabela Banner...');
    const bannersData = JSON.parse(fs.readFileSync('banners_backup.json', 'utf8'));
    for (const banner of bannersData) {
        await prisma.banner.create({
            data: {
                id: banner.id,
                banners: banner.banners
            }
        });
    }
    console.log('Tabela Banner restaurada com sucesso!');

    // 4. Restaura a homepage
    console.log('Restaurando a tabela HomepageSection...');
    const homepageSectionsData = JSON.parse(fs.readFileSync('homepageSection_backup.json', 'utf8'));
    await prisma.homepageSection.createMany({
        data: homepageSectionsData
    });
    console.log('Tabela HomepageSection restaurada com sucesso!');

    // 5. Restaura os depoimentos
    console.log('Restaurando a tabela Testimonial...');
    const testimonialsData = JSON.parse(fs.readFileSync('testimonials_backup.json', 'utf8'));
    await prisma.testimonial.createMany({
      data: testimonialsData.map(t => ({
        id: t.id,
        name: t.name,
        type: t.type,
        content: t.content,
        createdAt: new Date(t.createdAt),
        updatedAt: new Date(t.updatedAt)
      }))
    });
    console.log('Tabela Testimonial restaurada com sucesso!');

    console.log('\nTodos os dados foram restaurados com sucesso!');

  } catch (error) {
    console.error("Erro ao restaurar os dados:", error);
  } finally {
    await prisma.$disconnect();
  }
}

restore();