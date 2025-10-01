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

// NOVO: Interface para as fotos secundárias do item
export interface ColecaoItemFoto {
    id?: string;
    url: string;
    caption: string | null;
    ordem: number;
    like: number | null;
    view: number | null;
    colecaoItemId: string;
}

export interface ColecaoItem {
    id: string;
    productMark: string;
    productModel: string;
    cor: string;
    img: string;
    slug: string;
    colecaoId: string;
    
    // Campos do Prisma
    size: string | null;
    price: number | null;
    price_card: number | null;
    like: number | null;
    view: number | null;
    
    // NOVO: Campo 'ordem' para ordenação do item
    ordem: number | null;
    
    // NOVO: Relação para as fotos secundárias
    fotos?: ColecaoItemFoto[];
}

export interface ColecaoProps {
    id: string; 
    title: string; 
    subtitle: string | null; 
    description: string | null;
    bgcolor: string | null; 
    buttonText: string | null; 
    buttonUrl: string | null;
    // O campo 'order' na Colecao é Int? no prisma, mas é 'order' no seu código
    order: number | null;
    slug: string; 
    items: ColecaoItem[];
}

export interface HomePageProps {
    banners: Banner[];
    menu: MenuItem | null;
    testimonials: TestimonialItem[];
    faqs: FaqItem[];
    colecoes: ColecaoProps[];
}