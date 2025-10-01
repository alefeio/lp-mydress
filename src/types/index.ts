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
    id: string; // Geralmente, ao recuperar do DB, o ID existe
    url: string;
    caption: string | null; // String? no Prisma
    ordem: number; // Int @default(0) no Prisma
    like: number; // Int @default(0) no Prisma
    view: number; // Int @default(0) no Prisma
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

    // Campos do Prisma que são opcionais (String? / Int?)
    size: string | null;
    price: number | null;
    price_card: number | null;

    // Campos do Prisma que possuem @default(0) e NÃO são opcionais (?)
    like: number;
    view: number;

    // NOVO: Campo 'ordem' para ordenação do item (Int @default(0))
    ordem: number;

    // NOVO: Relação para as fotos secundárias (ColecaoItemFoto[])
    // O Prisma sempre retorna um array (vazio se não houver fotos)
    fotos: ColecaoItemFoto[];
}

export interface ColecaoProps {
    id: string;
    title: string;
    subtitle: string | null;
    description: string | null;
    bgcolor: string | null;
    buttonText: string | null;
    buttonUrl: string | null;
    order: number;

    // CORREÇÃO OBRIGATÓRIA: Adicione esta linha!
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