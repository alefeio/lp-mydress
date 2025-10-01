// /pages/api/crud/colecoes.ts

import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ColecaoProps, ColecaoItem } from '../../../types'; 
// OBSERVAÇÃO: Lembre-se de que se o erro de tipagem persistir, você DEVE adicionar 
// 'slug' a ColecaoProps e 'description' a ColecaoItem em '../../../types'.

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    // Bloco try...finally para garantir que o prisma.$disconnect() seja chamado
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                try {
                    const colecoes = await prisma.colecao.findMany({
                        include: {
                            items: {
                                // CORRETO: Ordena por 'ordem' (prioridade) e depois por 'like'
                                orderBy: [
                                    { ordem: 'asc' },
                                    { like: 'desc' },
                                ],
                                include: { // Adicionado 'fotos' com orderBy
                                    fotos: {
                                        orderBy: { ordem: 'asc' },
                                    }
                                },
                            },
                        },
                        orderBy: {
                            // CORRETO: Ordena a Coleção por 'order'
                            order: 'asc',
                        },
                    });

                    // Recria o slug dinamicamente (para Colecao e ColecaoItem)
                    const colecoesComSlugs: ColecaoProps[] = colecoes.map((colecao: any) => ({
                        ...colecao,
                        // Colecao não tem slug no DB, mas o frontend espera
                        slug: slugify(colecao.title),
                        items: colecao.items.map((item: any) => ({
                            ...item,
                            // Recria o slug do item se necessário
                            slug: item.slug || slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                        }))
                    })) as ColecaoProps[];

                    return res.status(200).json({ success: true, colecoes: colecoesComSlugs });
                } catch (error) {
                    console.error('Erro ao buscar coleções:', error);
                    return res.status(500).json({ success: false, message: 'Erro ao buscar coleções.' });
                }
                break;

            // ----------------------------------------------------------------------
            // POST: Criação de Coleção e Itens/Fotos
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
                            order: order ?? 0, // Garante que 'order' seja 0 se for null/undefined
                            items: {
                                // Mapeia os itens e prepara para criação aninhada
                                create: (items || []).map((item: ColecaoItem) => ({
                                    productMark: item.productMark,
                                    productModel: item.productModel,
                                    cor: item.cor,
                                    img: item.img as string,
                                    ordem: item.ordem ?? 0, 
                                    slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                                    size: item.size,
                                    price: item.price,
                                    price_card: item.price_card,
                                    like: item.like ?? 0, 
                                    view: item.view ?? 0, 
                                    fotos: { // Criação aninhada das fotos (ColecaoItemFoto)
                                        create: item.fotos?.map(foto => ({
                                            url: foto.url as string,
                                            caption: foto.caption,
                                            ordem: foto.ordem ?? 0, 
                                            like: foto.like ?? 0, 
                                            view: foto.view ?? 0, 
                                        })) ?? []
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
                } catch (error: any) {
                    console.error('Erro ao criar coleção:', error);
                    if (error.code === 'P2002') {
                        return res.status(409).json({ success: false, message: 'Erro de unicidade: Já existe um item com este slug. Por favor, ajuste a Marca, Modelo ou Cor.' });
                    }
                    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
                }
                break;

            // ----------------------------------------------------------------------
            // PUT: Atualização de Coleção e Itens/Fotos (CORRIGIDO PARA ADD NOVO ITEM)
            // ----------------------------------------------------------------------
            case 'PUT':
                try {
                    const { id, items, ...restColecao } = req.body as ColecaoProps & { id: string };

                    if (!id) {
                        return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para atualização.' });
                    }

                    // 1. Prepara dados da Colecao principal
                    const colecaoData = { ...restColecao, order: restColecao.order ?? 0 };

                    // 2. Transação para CRUD dos ColecaoItem e ColecaoItemFoto
                    const transactionActions: any[] = [];
                    const itemIdsToKeep: string[] = [];

                    // Ação para Colecao principal:
                    transactionActions.push(prisma.colecao.update({
                        where: { id },
                        data: colecaoData,
                    }));

                    if (items && Array.isArray(items)) {
                        items.forEach((item: ColecaoItem) => {
                            const itemSlug = slugify(`${item.productMark}-${item.productModel}-${item.cor}`);

                            // Dados base do item (para Update e Create)
                            const baseItemData = {
                                productMark: item.productMark,
                                productModel: item.productModel,
                                cor: item.cor,
                                img: item.img as string,
                                slug: itemSlug,
                                ordem: item.ordem ?? 0,
                                size: item.size,
                                price: item.price,
                                price_card: item.price_card,
                                like: item.like ?? 0,
                                view: item.view ?? 0,
                                // O campo 'description' não está no seu modelo, mas se existisse, estaria aqui.
                            };

                            // --- Item Existente: UPDATE (com upsert de fotos) ---
                            if (item.id) {
                                itemIdsToKeep.push(item.id);

                                transactionActions.push(prisma.colecaoItem.update({
                                    where: { id: item.id },
                                    data: {
                                        ...baseItemData,
                                        fotos: {
                                            // UPSERT: Atualiza/Cria fotos filhas
                                            upsert: item.fotos?.map(foto => ({
                                                where: { id: foto.id || 'non-existent-id' }, // Se foto.id existe, atualiza; senão, cria
                                                create: {
                                                    url: foto.url as string, caption: foto.caption, ordem: foto.ordem ?? 0, like: foto.like ?? 0, view: foto.view ?? 0,
                                                },
                                                update: {
                                                    url: foto.url as string, caption: foto.caption, ordem: foto.ordem ?? 0, like: foto.like ?? 0, view: foto.view ?? 0,
                                                }
                                            })) ?? [],
                                            // DELETE MANY: Exclui fotos que foram removidas da lista do frontend
                                            deleteMany: {
                                                colecaoItemId: item.id,
                                                id: {
                                                    notIn: item.fotos?.filter(f => f.id).map(f => f.id as string) ?? []
                                                }
                                            }
                                        },
                                    },
                                }));
                            } 
                            // --- Item Novo: CREATE (com criação aninhada de fotos) ---
                            else {
                                // ESTE BLOCO GARANTE QUE O NOVO ITEM É CRIADO CORRETAMENTE COM SUAS FOTOS
                                transactionActions.push(prisma.colecaoItem.create({
                                    data: {
                                        ...baseItemData,
                                        colecaoId: id, // Associa ao ID da coleção principal
                                        fotos: {
                                            create: item.fotos?.map(foto => ({
                                                url: foto.url as string, caption: foto.caption, ordem: foto.ordem ?? 0, like: foto.like ?? 0, view: foto.view ?? 0,
                                            })) ?? [],
                                        },
                                    },
                                }));
                            }
                        });

                        // 3. Deleta itens que existiam no DB, mas não estão na lista de 'items' enviada
                        const deleteItems = prisma.colecaoItem.deleteMany({
                            where: {
                                colecaoId: id,
                                id: { notIn: itemIdsToKeep },
                            },
                        });
                        transactionActions.push(deleteItems);

                        await prisma.$transaction(transactionActions);
                    }


                    // 4. Retorna a coleção completa e atualizada
                    const colecaoComItensAtualizados = await prisma.colecao.findUnique({
                        where: { id },
                        include: {
                            items: {
                                include: { fotos: true },
                                orderBy: [{ ordem: 'asc' }, { like: 'desc' }]
                            }
                        },
                    });

                    // Recria o slug na resposta
                    const finalResponse = {
                        ...colecaoComItensAtualizados,
                        slug: slugify(colecaoComItensAtualizados?.title || ''),
                        items: colecaoComItensAtualizados?.items.map((item: any) => ({
                            ...item,
                            slug: item.slug || slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                        }))
                    };


                    return res.status(200).json({ success: true, data: finalResponse });
                } catch (error: any) {
                    console.error('Erro ao atualizar coleção:', error);
                    if (error.code === 'P2002') {
                        return res.status(409).json({ success: false, message: 'Erro de unicidade: Já existe um item com este slug. Por favor, ajuste a Marca, Modelo ou Cor.' });
                    }
                    return res.status(500).json({ success: false, message: 'Erro ao atualizar coleção.' });
                }
                break;

            // ----------------------------------------------------------------------
            // DELETE: Exclusão de Coleção (CORRIGIDO PARA USAR ID DE QUERY)
            // ----------------------------------------------------------------------
            case 'DELETE':
                try {
                    // Espera o ID da Coleção como parâmetro de query
                    const { id: colecaoId } = req.query as { id: string };
                    // Permite deletar item individual enviando itemId no corpo (opcional)
                    const { itemId } = req.body as { itemId: string };

                    if (itemId) {
                        // Deleta o ColecaoItem (e suas fotos em cascata)
                        await prisma.colecaoItem.delete({ where: { id: itemId } });
                        return res.status(200).json({ success: true, message: 'Item excluído com sucesso.' });
                    }

                    // Se não houver itemId, tenta deletar a Coleção
                    if (!colecaoId) {
                        return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para exclusão.' });
                    }

                    // Exclui a Colecao (e seus itens/fotos em cascata via onDelete: Cascade)
                    const deletedColecao = await prisma.colecao.delete({
                        where: { id: colecaoId },
                    });

                    return res.status(200).json({ success: true, message: `Coleção excluída com sucesso. ID: ${deletedColecao.id}` });
                } catch (error: any) {
                    console.error('Erro ao excluir:', error);
                    if (error.code === 'P2025') {
                        return res.status(404).json({ success: false, message: 'Coleção ou Item não encontrado.' });
                    }
                    return res.status(500).json({ success: false, message: 'Erro ao excluir.' });
                }
                break;

            default:
                res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
                return res.status(405).end(`Método ${method} não permitido`);
        }
    } finally {
        await prisma.$disconnect();
    }
}