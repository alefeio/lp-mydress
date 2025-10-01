// types.ts

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

// --- NOVAS INTERFACES ---

/**
 * Interface para as fotos adicionais de um ColecaoItem
 * A URL pode ser uma string (existente) ou File (para upload no frontend)
 */
export interface ColecaoItemFoto {
    id?: string;
    url: string | File; 
    caption: string | null;
    ordem: number; // Campo de ordenação da foto secundária
    colecaoItemId?: string;
    like?: number | null;
    view?: number | null;
}

/**
 * Interface para um item dentro de uma coleção, agora com ordenação e múltiplas fotos
 */
export interface ColecaoItem {
    id: string;
    productMark: string;
    productModel: string;
    cor: string;
    img: string; // Imagem principal (mantida)
    slug: string;
    colecaoId: string;
    
    // NOVO: Campo de ordenação do item na coleção
    ordem: number; 
    
    // NOVO: Array de fotos adicionais
    fotos: ColecaoItemFoto[];

    description?: string | null;
    size?: string | null;
    price?: number | null;
    price_card?: number | null;
    like?: number | null;
    view?: number | null;
}

export interface ColecaoProps {
    id: string; 
    title: string; 
    subtitle: string | null; 
    description: string | null;
    bgcolor: string | null; 
    buttonText: string | null; 
    buttonUrl: string | null;
    // O campo 'order' é o de ordenação da Coleção (modelo Colecao)
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