import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ColecaoProps, ColecaoItem } from '../../../types'; // Assumindo que você atualizou 'types.ts'

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

// O tipo auxiliar foi ajustado para refletir a estrutura do retorno do Prisma
type PrismaColecaoWithItems = Omit<ColecaoProps, 'slug'> & {
    items: ColecaoItem[];
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                try {
                    const colecoes = await prisma.colecao.findMany({
                        include: {
                            items: {
                                // NOVO: Ordenar os ColecaoItem pelo novo campo 'ordem'
                                orderBy: [
                                    { ordem: 'asc' }, // Ordena pela ordem definida no formulário
                                    { like: 'desc' },
                                ],
                                select: {
                                    id: true,
                                    productMark: true,
                                    productModel: true,
                                    cor: true,
                                    img: true, // Imagem principal mantida
                                    slug: true,
                                    colecaoId: true,
                                    size: true,
                                    price: true,
                                    price_card: true,
                                    like: true,
                                    view: true,
                                    ordem: true, // NOVO: Campo ordem
                                    fotos: { // NOVO: Incluir as fotos adicionais
                                        orderBy: { ordem: 'asc' }, // Ordena as fotos pelo campo 'ordem'
                                        select: {
                                            id: true,
                                            url: true,
                                            caption: true,
                                            ordem: true,
                                        }
                                    }
                                },
                            },
                        },
                        orderBy: {
                            order: {
                                sort: 'asc',
                                nulls: 'last',
                            },
                        },
                    });

                    // Cria slugs dinamicamente (como já estava)
                    const colecoesComSlugs: ColecaoProps[] = colecoes.map((colecao) => ({
                        ...colecao,
                        slug: slugify(colecao.title),
                        items: colecao.items.map((item) => ({
                            ...item,
                            slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                        }))
                    }));

                    return res.status(200).json({ success: true, colecoes: colecoesComSlugs });
                } catch (error) {
                    console.error('Erro ao buscar coleções:', error);
                    return res.status(500).json({ success: false, message: 'Erro ao buscar coleções.' });
                }

            // ----------------------------------------------------------------------
            // POST: Criação de Coleção e Itens
            // ----------------------------------------------------------------------
            case 'POST':
                try {
                    const { title, subtitle, description, bgcolor, buttonText, buttonUrl, order, items } = req.body as ColecaoProps;

                    const createdColecao = await prisma.colecao.create({
                        data: {
                            title,
                            subtitle,
                            description,
                            bgcolor,
                            buttonText,
                            buttonUrl,
                            order,
                            items: {
                                // CORREÇÃO AQUI: Garante que estamos usando apenas o subset de dados esperado pelo Prisma.
                                create: (items || []).map(item => ({
                                    productMark: item.productMark,
                                    productModel: item.productModel,
                                    cor: item.cor,
                                    img: item.img as string, // Cast para string, pois o upload foi feito
                                    ordem: item.ordem ?? 0,
                                    slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                                    size: item.size,
                                    price: item.price,
                                    price_card: item.price_card,
                                    like: item.like ?? 0,
                                    view: item.view ?? 0,
                                    fotos: {
                                        create: item.fotos.map(foto => ({
                                            // NOVO: Garante que 'url' é uma string e remove a propriedade 'id'
                                            url: foto.url as string,
                                            caption: foto.caption,
                                            ordem: foto.ordem ?? 0,
                                        }))
                                    }
                                })),
                            },
                        },
                        include: {
                            items: {
                                include: { fotos: true }
                            },
                        },
                    });
                    return res.status(201).json({ success: true, data: createdColecao });
                } catch (error) {
                    console.error('Erro ao criar coleção:', error);
                    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
                }

            // ----------------------------------------------------------------------
            // PUT: Atualização de Coleção e Itens (Complexo devido à aninhamento)
            // ----------------------------------------------------------------------
            case 'PUT':
                try {
                    const { id, items, ...rest } = req.body as ColecaoProps & { id: string };

                    if (!id) {
                        return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para atualização.' });
                    }

                    // 1. Atualiza a coleção principal
                    await prisma.colecao.update({
                        where: { id },
                        data: {
                            title: rest.title,
                            subtitle: rest.subtitle,
                            description: rest.description,
                            bgcolor: rest.bgcolor,
                            buttonText: rest.buttonText,
                            buttonUrl: rest.buttonUrl,
                            order: rest.order,
                        },
                    });

                    // 2. Transação para criar ou atualizar os itens e suas fotos
                    // 2. Transação para criar ou atualizar os itens e suas fotos
                    if (items && Array.isArray(items)) {
                        const transaction = items.map((item: ColecaoItem) => {
                            const itemSlug = slugify(`${item.productMark}-${item.productModel}-${item.cor}`);

                            const baseData = {
                                productMark: item.productMark,
                                productModel: item.productModel,
                                cor: item.cor,
                                img: item.img as string, // OK: Cast da imagem principal
                                slug: itemSlug,
                                ordem: item.ordem ?? 0,
                                size: item.size,
                                price: item.price,
                                price_card: item.price_card,
                                like: item.like ?? 0,
                                view: item.view ?? 0,
                                fotos: {
                                    // CORREÇÃO AQUI: Dentro do upsert, aplicamos o cast nas operações
                                    upsert: item.fotos.map(foto => ({
                                        where: { id: foto.id || 'new-id' },
                                        create: {
                                            url: foto.url as string, // CORRIGIDO: Cast para string na criação
                                            caption: foto.caption,
                                            ordem: foto.ordem ?? 0,
                                        },
                                        update: {
                                            url: foto.url as string, // CORRIGIDO: Cast para string na atualização
                                            caption: foto.caption,
                                            ordem: foto.ordem ?? 0,
                                        }
                                    })),
                                },
                            };

                            // 2a. Se o item tem ID, atualiza
                            if (item.id) {
                                return prisma.colecaoItem.update({
                                    where: { id: item.id },
                                    data: baseData,
                                });
                            }
                            // 2b. Se o item NÃO tem ID, cria ele com suas fotos
                            else {
                                return prisma.colecaoItem.create({
                                    data: {
                                        ...baseData,
                                        colecaoId: id,
                                    },
                                });
                            }
                        });

                        // 3. Obtém IDs de itens a serem mantidos e deleta os que não foram enviados (soft delete é recomendado)
                        const itemIdsToKeep = items.filter(i => i.id).map(i => i.id as string);

                        const deleteItems = prisma.colecaoItem.deleteMany({
                            where: {
                                colecaoId: id,
                                id: { notIn: itemIdsToKeep },
                            },
                        });

                        await prisma.$transaction([...transaction, deleteItems]);
                    }

                    // 4. Retorna a coleção completa e atualizada
                    const colecaoComItensAtualizados = await prisma.colecao.findUnique({
                        where: { id },
                        include: {
                            items: {
                                include: { fotos: true }
                            }
                        },
                    });

                    return res.status(200).json({ success: true, data: colecaoComItensAtualizados });
                } catch (error) {
                    console.error('Erro ao atualizar coleção:', error);
                    return res.status(500).json({ success: false, message: 'Erro ao atualizar coleção.' });
                }

            // ----------------------------------------------------------------------
            // DELETE: Mantido igual (exclui Colecao, a exclusão dos itens é feita em cascata)
            // ----------------------------------------------------------------------
            case 'DELETE':
                try {
                    // O seu frontend envia { id, isItem: true } no corpo, não no query. Ajustando para o corpo:
                    const { id, isItem } = req.body;

                    if (isItem) {
                        if (!id || typeof id !== 'string') {
                            return res.status(400).json({ success: false, message: 'ID do item é obrigatório para exclusão.' });
                        }
                        // Se for um item, exclui o ColecaoItem (e suas fotos em cascata)
                        await prisma.colecaoItem.delete({ where: { id } });
                        return res.status(200).json({ success: true, message: 'Item excluído com sucesso.' });
                    }

                    if (!id || typeof id !== 'string') {
                        return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para exclusão.' });
                    }

                    // Se não for um item, exclui a Colecao (e seus itens/fotos em cascata)
                    await prisma.colecao.delete({
                        where: { id },
                    });

                    return res.status(200).json({ success: true, message: 'Coleção excluída com sucesso.' });
                } catch (error) {
                    console.error('Erro ao excluir:', error);
                    return res.status(500).json({ success: false, message: 'Erro ao excluir.' });
                }

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Método ${method} não permitido`);
        }
    } finally {
        await prisma.$disconnect();
    }
}