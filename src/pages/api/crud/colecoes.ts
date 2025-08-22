import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ColecaoProps, ColecaoItem } from '../../../types';

const prisma = new PrismaClient();

// Função para gerar o slug a partir de uma string
function slugify(text: string): string {
    return text.toString().toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]+/g, '')
        .replace(/--+/g, '-')
        .replace(/-+$/, '');
}

// Tipos auxiliares que correspondem ao que o Prisma retorna.
// O tipo 'ColecaoItem' já é a sua interface e o Prisma retorna um objeto compatível.
type PrismaColecaoWithItems = Omit<ColecaoProps, 'slug'> & {
    items: ColecaoItem[];
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    switch (method) {
        case 'GET':
            try {
                const colecoes = await prisma.colecao.findMany({
                    include: {
                        items: true,
                    },
                    orderBy: {
                        order: 'asc',
                    },
                });

                // Tipagem explícita para o parâmetro 'colecao' usando o tipo auxiliar
                const colecoesComSlugs: ColecaoProps[] = colecoes.map((colecao: PrismaColecaoWithItems) => ({
                    ...colecao,
                    slug: slugify(colecao.title),
                    // Tipagem explícita para o parâmetro 'item'
                    items: colecao.items.map((item: ColecaoItem) => ({ 
                        ...item,
                        slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                    }))
                }));

                return res.status(200).json({ success: true, colecoes: colecoesComSlugs });
            } catch (error) {
                console.error('Erro ao buscar coleções:', error);
                return res.status(500).json({ success: false, message: 'Erro ao buscar coleções.' });
            }

        case 'POST':
            try {
                // Adicionado 'order' na desestruturação
                const { title, subtitle, description, bgcolor, buttonText, buttonUrl, order, items } = req.body as ColecaoProps;

                const itemsWithSlugs = (items || []).map((item: ColecaoItem) => ({
                    ...item,
                    slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                }));

                const createdColecao = await prisma.colecao.create({
                    data: {
                        title,
                        subtitle,
                        description,
                        bgcolor,
                        buttonText,
                        buttonUrl,
                        // Adicionado 'order' na criação
                        order,
                        items: {
                            create: itemsWithSlugs,
                        },
                    },
                    include: {
                        items: true,
                    },
                });
                return res.status(201).json({ success: true, data: createdColecao });
            } catch (error) {
                console.error('Erro ao criar coleção:', error);
                return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
            }

        case 'PUT':
            try {
                const { id, items, ...rest } = req.body as ColecaoProps & { id: string };

                if (!id) {
                    return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para atualização.' });
                }

                const updatedColecao = await prisma.colecao.update({
                    where: { id },
                    data: {
                        title: rest.title,
                        subtitle: rest.subtitle,
                        description: rest.description,
                        bgcolor: rest.bgcolor,
                        buttonText: rest.buttonText,
                        buttonUrl: rest.buttonUrl,
                        // Adicionado 'order' na atualização
                        order: rest.order,
                    },
                });

                if (items && Array.isArray(items)) {
                    const itemsWithSlugs = items.map((item: ColecaoItem) => ({
                        ...item,
                        slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                    }));
                    
                    const transaction = itemsWithSlugs.map((item: ColecaoItem) => {
                        if (item.id) {
                            return prisma.colecaoItem.update({
                                where: { id: item.id },
                                data: { ...item },
                            });
                        } else {
                            return prisma.colecaoItem.create({
                                data: {
                                    ...item,
                                    colecaoId: id,
                                },
                            });
                        }
                    });
                    await prisma.$transaction(transaction);
                }

                const colecaoComItensAtualizados = await prisma.colecao.findUnique({
                    where: { id },
                    include: { items: true },
                });

                return res.status(200).json({ success: true, data: colecaoComItensAtualizados });
            } catch (error) {
                console.error('Erro ao atualizar coleção:', error);
                return res.status(500).json({ success: false, message: 'Erro ao atualizar coleção.' });
            }

        default:
            res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
            res.status(405).end(`Método ${method} não permitido`);
    }
}