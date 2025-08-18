import { PrismaClient } from '@prisma/client';
import { GetServerSideProps } from 'next';
import Home from '../index';
import { useRouter } from 'next/router';

// Tipagens para os dados
interface Banner {
  id: number;
  banners: {
    id: string;
    url: string;
    link: string;
    title: string;
    target: string;
  }[];
}

interface MenuItem {
  id: number;
  logoUrl: string;
  links: {
    id: string;
    url: string;
    text: string;
    target: string;
  }[];
}

interface TestimonialItem {
  id: string;
  name: string;
  content: string;
  type: string;
}

interface FaqItem {
  id: string;
  pergunta: string;
  resposta: string;
}

interface HomePageProps {
  banners: Banner[];
  menu: MenuItem | null;
  testimonials: TestimonialItem[];
  faqs: FaqItem[];
}

const prisma = new PrismaClient();

// Função que busca todos os dados necessários no servidor
export const getServerSideProps: GetServerSideProps<HomePageProps> = async () => {
  try {
    const [banners, menus, testimonials, faqs] = await Promise.all([
      prisma.banner.findMany(),
      prisma.menu.findMany(),
      prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } }),
      prisma.fAQ.findMany({ orderBy: { pergunta: 'asc' } }),
    ]);

    const menu = menus.length > 0 ? menus[0] : null;

    return {
      props: {
        banners: JSON.parse(JSON.stringify(banners)),
        menu: JSON.parse(JSON.stringify(menu)),
        testimonials: JSON.parse(JSON.stringify(testimonials)),
        faqs: JSON.parse(JSON.stringify(faqs)),
      },
    };
  } catch (error) {
    console.error("Erro ao buscar dados do banco de dados:", error);
    return {
      props: {
        banners: [],
        menu: null,
        testimonials: [],
        faqs: [],
      },
    };
  } finally {
    await prisma.$disconnect();
  }
};

export default function ProductPage({ banners, menu, testimonials, faqs }: HomePageProps) {
  const router = useRouter();

  // O componente Home agora é renderizado com todas as props necessárias
  return <Home banners={banners} menu={menu} testimonials={testimonials} faqs={faqs} />;
}