// src/types/index.ts

export interface Banner {
    id: number;
    banners: {
        id: string;
        url: string;
        link: string;
        title: string;
        target: string;
    }[];
}

export interface MenuItem {
    id: number;
    logoUrl: string;
    links: {
        id: string;
        url: string;
        text: string;
        target: string;
    }[];
}

export interface TestimonialItem {
    id: string;
    name: string;
    content: string;
    type: string;
}

export interface FaqItem {
    id: string;
    pergunta: string;
    resposta: string;
}

export interface ColecaoItem {
    id: string; productMark: string; productModel: string; cor: string;
    img: string; slug: string; colecaoId: string;
    description?: string | null; // <-- Propriedade 'description' adicionada aqui
}

export interface ColecaoProps {
    id: string; title: string; subtitle: string | null; description: string | null;
    bgcolor: string | null; buttonText: string | null; buttonUrl: string | null;
    slug: string; items: ColecaoItem[];
}

export interface HomePageProps {
    banners: Banner[];
    menu: MenuItem | null;
    testimonials: TestimonialItem[];
    faqs: FaqItem[];
    colecoes: ColecaoProps[];
}