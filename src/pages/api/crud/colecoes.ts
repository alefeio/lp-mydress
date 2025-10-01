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
                    const { id, items, title, subtitle, description, ...restColecao } = req.body;

                    // 🛑 CONSOLE NO BACKEND - REQUISIÇÃO RECEBIDA 🛑
                    console.log(`[BACKEND - PUT] Requisição de atualização recebida para Coleção ID: ${id}`);
                    console.log(`[BACKEND - PUT] Total de itens recebidos: ${items ? items.length : 0}`);
                    console.log("--------------------------------------------------------------------");
                    // FIM CONSOLE NO BACKEND

                    if (!id || !items) {
                        return res.status(400).json({ success: false, message: 'ID da coleção e itens são obrigatórios para a atualização.' });
                    }

                    const transactionActions: any[] = [];
                    const itemIdsToKeep: string[] = [];

                    // 1. Processar Itens: Identificar existentes para UPDATE e novos para CREATE
                    for (const item of items) {
                        // ... (Restante da definição de itemData) ...

                        // 🛑 CONSOLE NO BACKEND - ITEM INDIVIDUAL 🛑
                        console.log(`[BACKEND - LOOP] Processando Item: ${item.productModel || 'Sem Modelo'}. ID Recebido: ${item.id}`);
                        // FIM CONSOLE NO BACKEND

                        // Limpar campos nulos (se o frontend enviou null) para evitar erros do Prisma
                        // ... (código de normalização) ...

                        // O item é NOVO se não tiver um ID, ou se o ID for uma string vazia (o que não deve acontecer)
                        if (!item.id || typeof item.id !== 'string' || item.id.trim() === '') {

                            // --- AQUI É O BLOCO DE CRIAÇÃO (CREATE) ---

                            console.log(`[BACKEND - CREATE] 🟢 Item NOVO detectado: ${item.productModel}. Criando...`);

                            const createItemAction = prisma.colecaoItem.create({
                                data: {
                                    // ... (restante da lógica de createItemAction) ...
                                    colecaoId: id,
                                    fotos: {
                                        create: (item.fotos || []).map((foto: any) => ({
                                            url: foto.url,
                                            caption: foto.caption,
                                            ordem: foto.ordem || 0,
                                        })),
                                    },
                                },
                            });

                            transactionActions.push(createItemAction);

                        } else {
                            // --- Item EXISTENTE: UPDATE ---
                            itemIdsToKeep.push(item.id);

                            console.log(`[BACKEND - UPDATE] 🔵 Item EXISTENTE detectado: ${item.productModel} (${item.id}). Atualizando...`);

                            // ... (restante da lógica de UPDATE de fotos e item) ...

                            // 1. Coleta IDs de fotos existentes para manter
                            const fotoIdsToKeep: string[] = item.fotos
                                .filter((foto: any) => foto.id && typeof foto.id === 'string')
                                .map((foto: any) => foto.id);

                            // 2. Adiciona ações para remover fotos antigas que não estão mais na lista
                            transactionActions.push(prisma.colecaoItemFoto.deleteMany({
                                where: {
                                    colecaoItemId: item.id,
                                    id: { notIn: fotoIdsToKeep },
                                },
                            }));

                            // 3. Adiciona a ação de UPDATE principal (com upsert das fotos)
                            const updateItemAction = prisma.colecaoItem.update({
                                where: { id: item.id },
                                data: {
                                    // ... (restante da lógica de updateItemAction) ...
                                    fotos: {
                                        upsert: (item.fotos || []).map((foto: any) => ({
                                            where: { id: foto.id || 'NO_ID_FOR_CREATE' },
                                            update: {
                                                url: foto.url,
                                                caption: foto.caption,
                                                ordem: foto.ordem || 0,
                                            },
                                            create: {
                                                url: foto.url,
                                                caption: foto.caption,
                                                ordem: foto.ordem || 0,
                                            },
                                        })),
                                    },
                                },
                            });
                            transactionActions.push(updateItemAction);
                        }
                    }

                    // 2. Ação de limpeza e atualização da coleção principal
                    transactionActions.push(prisma.colecao.update({
                        // ... (código de update da coleção e deleteMany de itens) ...
                    }));

                    // 🛑 CONSOLE NO BACKEND - TRANSAÇÃO 🛑
                    console.log(`[BACKEND - TRANSAÇÃO] Executando ${transactionActions.length} ações no banco de dados.`);
                    // FIM CONSOLE NO BACKEND

                    await prisma.$transaction(transactionActions);

                    console.log(`[BACKEND - SUCESSO] Transação da coleção ${id} concluída com sucesso.`);
                    return res.status(200).json({ success: true, message: 'Coleção e itens atualizados com sucesso.' });

                } catch (error) {
                    // 🛑 CONSOLE NO BACKEND - ERRO 🛑
                    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    console.error('[BACKEND - ERRO CRÍTICO] Falha na atualização da coleção (PUT):', error);
                    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                    // FIM CONSOLE NO BACKEND
                    return res.status(500).json({ success: false, message: 'Erro ao atualizar coleção e itens.', error: error instanceof Error ? error.message : 'Erro desconhecido.' });
                }
                break;

            // ----------------------------------------------------------------------
            // DELETE: Exclusão de Coleção (CORRIGIDO PARA USAR ID DE QUERY)
            // ----------------------------------------------------------------------
            case 'DELETE':
                try {
                    // LÊ O ID DA COLEÇÃO OU ITEM DO CORPO (req.body)
                    const { id, isItem } = req.body as { id: string; isItem: boolean };

                    // Caso o ID seja de um Item (ColecaoItem)
                    if (isItem && id) {
                        // Deleta o ColecaoItem (e suas fotos em cascata)
                        await prisma.colecaoItem.delete({ where: { id } });
                        return res.status(200).json({ success: true, message: 'Item excluído com sucesso.' });
                    }

                    // Caso o ID seja da Coleção (Colecao)
                    const colecaoId = id;

                    if (!colecaoId) {
                        // Este é o bloco que estava sendo ativado por erro
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