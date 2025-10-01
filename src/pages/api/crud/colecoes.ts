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
    console.log(`[BACKEND - START] Recebida requisição ${req.method} em /api/crud/colecoes`);
    // Bloco try...finally para garantir que o prisma.$disconnect() seja chamado
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                try {
                    const colecoes = await prisma.colecao.findMany({
                        include: {
                            items: {
                                orderBy: [{ ordem: 'asc' }, { like: 'desc' }],
                                include: { fotos: { orderBy: { ordem: 'asc' } } },
                            },
                        },
                        orderBy: { order: 'asc' },
                    });

                    const colecoesComSlugs: ColecaoProps[] = colecoes.map((colecao: any) => ({
                        ...colecao,
                        slug: slugify(colecao.title),
                        items: colecao.items.map((item: any) => ({
                            ...item,
                            slug: item.slug || slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                        }))
                    })) as ColecaoProps[];

                    return res.status(200).json({ success: true, colecoes: colecoesComSlugs });
                } catch (error) {
                    console.error('[BACKEND - GET ERROR] Erro ao buscar coleções:', error);
                    return res.status(500).json({ success: false, message: 'Erro ao buscar coleções.' });
                }
                // ... (O restante do GET está ok) ...
                break;

            // ----------------------------------------------------------------------
            // POST: Criação de Coleção e Itens/Fotos
            // ----------------------------------------------------------------------
            case 'POST':
                try {
                    // ... (O restante do POST está ok) ...
                    const { title, subtitle, description, bgcolor, buttonText, buttonUrl, order, items } = req.body as ColecaoProps;

                    const createdColecao = await prisma.colecao.create({
                        data: {
                            title,
                            subtitle,
                            description,
                            bgcolor,
                            buttonText,
                            buttonUrl,
                            order: order ?? 0,
                            items: {
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
                                    fotos: {
                                        create: item.fotos?.map(foto => ({
                                            url: foto.url as string, caption: foto.caption, ordem: foto.ordem ?? 0, like: foto.like ?? 0, view: foto.view ?? 0,
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
                    console.error('[BACKEND - POST ERROR] Erro ao criar coleção:', error);
                    if (error.code === 'P2002') {
                        return res.status(409).json({ success: false, message: 'Erro de unicidade: Já existe um item com este slug. Por favor, ajuste a Marca, Modelo ou Cor.' });
                    }
                    return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
                }
                break;

            // ----------------------------------------------------------------------
            // PUT: Atualização de Coleção e Itens/Fotos (CORRIGIDO E COM LOGS)
            // ----------------------------------------------------------------------
            case 'PUT':
                try {
                    const { id, items, ...restColecao } = req.body as ColecaoProps & { id: string };

                    console.log(`\n====================================================================`);
                    console.log(`[BACKEND - PUT] Recebido ID da Coleção: ${id}. Total de itens: ${items?.length}`);
                    console.log(`====================================================================`);


                    if (!id) {
                        return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para atualização.' });
                    }

                    // 1. Prepara dados da Colecao principal
                    const colecaoData = { ...restColecao, order: restColecao.order ?? 0 };

                    // 2. Transação para CRUD dos ColecaoItem e ColecaoItemFoto
                    const transactionActions: any[] = [];
                    const itemIdsToKeep: string[] = [];
                    const itemSlugsToCheck: { id?: string; slug: string }[] = [];

                    // Ação para Colecao principal (sem os itens, que são tratados abaixo):
                    transactionActions.push(prisma.colecao.update({
                        where: { id },
                        data: colecaoData,
                    }));

                    if (items && Array.isArray(items)) {
                        // PRIMEIRA PASSAGEM: COLETAR SLUGS PARA CHECAGEM ATÔMICA
                        for (const item of items) {
                            const itemSlug = slugify(`${item.productMark}-${item.productModel}-${item.cor}`);
                            itemSlugsToCheck.push({ id: item.id, slug: itemSlug });
                        }

                        // CHECAGEM DE UNICIDADE DE SLUG
                        const existingItemsBySlug = await prisma.colecaoItem.findMany({
                            where: { slug: { in: itemSlugsToCheck.map(i => i.slug) } },
                        });

                        for (const itemToCheck of itemSlugsToCheck) {
                            const foundItem = existingItemsBySlug.find(ei => ei.slug === itemToCheck.slug);
                            // Se encontrou um item com o mesmo slug E o ID é diferente (ou o ID do item é novo/vazio)
                            if (foundItem && foundItem.id !== itemToCheck.id) {
                                console.error(`[BACKEND - PUT ERRO UNICIDADE] Conflito de slug: ${itemToCheck.slug}. ID existente: ${foundItem.id}. ID novo/atualizado: ${itemToCheck.id}`);
                                return res.status(409).json({
                                    success: false,
                                    message: `Erro de unicidade: O slug '${itemToCheck.slug}' já está em uso por outro item. Por favor, ajuste a Marca, Modelo ou Cor.`,
                                });
                            }
                        }

                        // SEGUNDA PASSAGEM: PREPARA AS AÇÕES DE UPDATE/CREATE
                        for (const item of items) {
                            const itemSlug = slugify(`${item.productMark}-${item.productModel}-${item.cor}`);

                            // Normalização: Garante que campos opcionais vazios sejam nulos, se o DB permitir.
                            const baseItemData: any = {
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
                            };
                            Object.keys(baseItemData).forEach(key => {
                                if (baseItemData[key] === '') baseItemData[key] = null;
                            });


                            // 🛑 CONSOLE NO BACKEND - ITEM INDIVIDUAL 🛑
                            console.log(`[BACKEND - LOOP] Item: ${item.productModel || 'Sem Modelo'}. ID Recebido: ${item.id || 'NOVO'}.`);
                            // FIM CONSOLE NO BACKEND

                            // --- Item Existente: UPDATE (com upsert de fotos) ---
                            if (item.id && typeof item.id === 'string' && item.id.length > 0) {
                                itemIdsToKeep.push(item.id);
                                console.log(`[BACKEND - UPDATE] 🔵 Item existente. Adicionando UPDATE e DELETE de fotos antigas.`);

                                // IDs das fotos que DEVEM SER MANTIDAS
                                const fotoIdsToKeep = item.fotos?.filter(f => f.id).map(f => f.id as string) ?? [];

                                transactionActions.push(prisma.colecaoItem.update({
                                    where: { id: item.id },
                                    data: {
                                        ...baseItemData,
                                        fotos: {
                                            // Lógica de UPSERT e DELETE MANY para fotos
                                            upsert: item.fotos?.map(foto => ({
                                                where: { id: foto.id || 'non-existent-id' }, // Usa um ID inexistente para garantir que novas fotos caiam no 'create'
                                                create: {
                                                    url: foto.url as string, caption: foto.caption, ordem: foto.ordem ?? 0, like: foto.like ?? 0, view: foto.view ?? 0,
                                                },
                                                update: {
                                                    url: foto.url as string, caption: foto.caption, ordem: foto.ordem ?? 0, like: foto.like ?? 0, view: foto.view ?? 0,
                                                }
                                            })) ?? [],
                                            deleteMany: {
                                                colecaoItemId: item.id,
                                                id: { notIn: fotoIdsToKeep } // Exclui fotos cujos IDs não vieram na requisição
                                            }
                                        },
                                    },
                                }));
                            }
                            // --- Item Novo: CREATE (com criação aninhada de fotos) ---
                            else {
                                console.log(`[BACKEND - CREATE] 🟢 Item NOVO detectado: ${item.productModel}. Adicionando CREATE à transação.`);
                                
                                // NOVO ITEM: O ID não existe, usamos 'create'.
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
                        }

                        // 3. Deleta itens que existiam no DB, mas não estão na lista de 'itemIdsToKeep' 
                        // ESTE DELETE DEVE SER A ÚLTIMA AÇÃO RELACIONADA A ITENS
                        console.log(`[BACKEND - DELETE] Adicionando ação de DELETE para itens excluídos. IDs a manter: ${itemIdsToKeep.length}`);
                        const deleteItems = prisma.colecaoItem.deleteMany({
                            where: {
                                colecaoId: id,
                                id: { notIn: itemIdsToKeep },
                            },
                        });
                        transactionActions.push(deleteItems);

                        console.log(`[BACKEND - TRANSAÇÃO] Executando ${transactionActions.length} ações no banco de dados.`);
                        await prisma.$transaction(transactionActions);
                    }


                    // 4. Retorna a coleção completa e atualizada
                    console.log('[BACKEND - PUT SUCESSO] Buscando coleção atualizada para retorno...');
                    const colecaoComItensAtualizados = await prisma.colecao.findUnique({
                        where: { id },
                        include: {
                            items: {
                                include: { fotos: true },
                                orderBy: [{ ordem: 'asc' }, { like: 'desc' }]
                            }
                        },
                    });

                    if (!colecaoComItensAtualizados) {
                        return res.status(404).json({ success: false, message: 'Coleção não encontrada após atualização.' });
                    }

                    // Recria o slug na resposta
                    const finalResponse = {
                        ...colecaoComItensAtualizados,
                        slug: slugify(colecaoComItensAtualizados.title || ''),
                        items: colecaoComItensAtualizados.items.map((item: any) => ({
                            ...item,
                            slug: item.slug || slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                        }))
                    };

                    console.log('[BACKEND - PUT SUCESSO] Coleção atualizada e retornada.');
                    return res.status(200).json({ success: true, data: finalResponse });
                } catch (error: any) {
                    console.error('\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    console.error('[BACKEND - PUT ERRO CRÍTICO] Falha na atualização da coleção (PUT):', error.message);
                    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    return res.status(500).json({ success: false, message: 'Erro ao atualizar coleção.', error: error.message });
                }
                break;

            // ----------------------------------------------------------------------
            // DELETE: Exclusão de Coleção (CORRIGIDO PARA USAR ID DE BODY)
            // ----------------------------------------------------------------------
            case 'DELETE':
                try {
                    const { id, isItem } = req.body as { id: string; isItem: boolean };

                    if (!id) {
                        return res.status(400).json({ success: false, message: 'ID é obrigatório para exclusão.' });
                    }

                    if (isItem) {
                        console.log(`[BACKEND - DELETE] Deletando Item ID: ${id}`);
                        await prisma.colecaoItem.delete({ where: { id } });
                        return res.status(200).json({ success: true, message: 'Item excluído com sucesso.' });
                    } else {
                        console.log(`[BACKEND - DELETE] Deletando Coleção ID: ${id}`);
                        const deletedColecao = await prisma.colecao.delete({
                            where: { id },
                        });
                        return res.status(200).json({ success: true, message: `Coleção excluída com sucesso. ID: ${deletedColecao.id}` });
                    }
                } catch (error: any) {
                    console.error('[BACKEND - DELETE ERROR] Erro ao excluir:', error);
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