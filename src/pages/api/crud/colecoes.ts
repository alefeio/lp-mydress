import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ColecaoProps, ColecaoItem } from '../../../types'; 
// Assegure-se de que '../../../types' reflete as correções finais (ordem, like, view como 'number', não 'number | null')

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
                                include: { // Ajuste: Mudado 'select' para 'include' e adicionado 'fotos' com orderBy
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
                            order: order ?? 0, // AJUSTE: Garante que 'order' seja 0 se for null/undefined
                            items: {
                                // Mapeia os itens e prepara para criação aninhada
                                create: (items || []).map((item: ColecaoItem) => ({ 
                                    productMark: item.productMark,
                                    productModel: item.productModel,
                                    cor: item.cor,
                                    img: item.img as string, 
                                    ordem: item.ordem ?? 0, // AJUSTE: Garante que 'ordem' seja 0 se for null/undefined
                                    slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                                    size: item.size,
                                    price: item.price,
                                    price_card: item.price_card,
                                    like: item.like ?? 0, // AJUSTE: Garante que 'like' seja 0
                                    view: item.view ?? 0, // AJUSTE: Garante que 'view' seja 0
                                    fotos: { // NOVO: Criação aninhada das fotos (ColecaoItemFoto)
                                        create: item.fotos?.map(foto => ({
                                            url: foto.url as string, 
                                            caption: foto.caption,
                                            ordem: foto.ordem ?? 0, // AJUSTE: Garante que 'ordem' seja 0
                                            like: foto.like ?? 0, // AJUSTE: Garante que 'like' seja 0
                                            view: foto.view ?? 0, // AJUSTE: Garante que 'view' seja 0
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

            // ----------------------------------------------------------------------
            // PUT: Atualização de Coleção e Itens/Fotos
            // ----------------------------------------------------------------------
            case 'PUT':
                try {
                    // Separa o 'id' e 'items' do resto dos campos da Colecao
                    const { id, items, ...restColecao } = req.body as ColecaoProps & { id: string };

                    if (!id) {
                        return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para atualização.' });
                    }

                    // AJUSTE: Garante que 'order' da Colecao seja 0 se for null/undefined
                    const colecaoData = { ...restColecao, order: restColecao.order ?? 0 };

                    // 1. Atualiza a coleção principal
                    await prisma.colecao.update({
                        where: { id },
                        data: colecaoData,
                    });

                    // 2. Transação para CRUD dos ColecaoItem e ColecaoItemFoto
                    if (items && Array.isArray(items)) {
                        const transaction = items.map((item: ColecaoItem) => {
                            const itemSlug = slugify(`${item.productMark}-${item.productModel}-${item.cor}`);

                            // Dados base para o ColecaoItem (com ajustes de Nullish Coalescing)
                            const baseItemData = {
                                productMark: item.productMark,
                                productModel: item.productModel,
                                cor: item.cor,
                                img: item.img as string,
                                slug: itemSlug,
                                ordem: item.ordem ?? 0, // AJUSTE: Garante que 'ordem' seja 0
                                size: item.size,
                                price: item.price,
                                price_card: item.price_card,
                                like: item.like ?? 0, // AJUSTE: Garante que 'like' seja 0
                                view: item.view ?? 0, // AJUSTE: Garante que 'view' seja 0
                            };

                            // --- Item Existente: Update/Upsert ---
                            if (item.id) {
                                return prisma.colecaoItem.update({
                                    where: { id: item.id },
                                    data: {
                                        ...baseItemData,
                                        fotos: {
                                            // NOVO: Usa UPSERT para gerenciar fotos existentes/novas (ColecaoItemFoto)
                                            upsert: item.fotos?.map(foto => ({
                                                where: { id: foto.id || 'non-existent-id' }, 
                                                create: {
                                                    url: foto.url as string,
                                                    caption: foto.caption,
                                                    ordem: foto.ordem ?? 0, // AJUSTE: Garante que 'ordem' seja 0
                                                    like: foto.like ?? 0,
                                                    view: foto.view ?? 0,
                                                },
                                                update: {
                                                    url: foto.url as string,
                                                    caption: foto.caption,
                                                    ordem: foto.ordem ?? 0,
                                                    like: foto.like ?? 0,
                                                    view: foto.view ?? 0,
                                                }
                                            })) ?? [],
                                            // NOVO: Exclui fotos que existiam mas não foram enviadas na lista atual
                                            deleteMany: {
                                                colecaoItemId: item.id,
                                                id: {
                                                    notIn: item.fotos?.filter(f => f.id).map(f => f.id as string) ?? []
                                                }
                                            }
                                        },
                                    },
                                });
                            } 
                            // --- Item Novo: Create ---
                            else {
                                return prisma.colecaoItem.create({
                                    data: {
                                        ...baseItemData,
                                        colecaoId: id, // Associa ao ID da coleção atual
                                        fotos: {
                                            create: item.fotos?.map(foto => ({
                                                url: foto.url as string, 
                                                caption: foto.caption,
                                                ordem: foto.ordem ?? 0,
                                                like: foto.like ?? 0,
                                                view: foto.view ?? 0,
                                            })) ?? [],
                                        },
                                    },
                                });
                            }
                        });

                        // 3. Obtém IDs de itens a serem mantidos e deleta os que não foram enviados (ColecaoItem)
                        const itemIdsToKeep = items.filter(i => i.id).map(i => i.id as string);

                        // Deleta itens que existiam no DB, mas não estão na lista de 'items' enviada
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
                                include: { fotos: true },
                                // AJUSTE: Adiciona a ordenação aqui também
                                orderBy: [{ ordem: 'asc' }, { like: 'desc' }]
                            }
                        },
                    });

                    return res.status(200).json({ success: true, data: colecaoComItensAtualizados });
                } catch (error: any) {
                    console.error('Erro ao atualizar coleção:', error);
                     if (error.code === 'P2002') {
                         return res.status(409).json({ success: false, message: 'Erro de unicidade: Já existe um item com este slug. Por favor, ajuste a Marca, Modelo ou Cor.' });
                    }
                    return res.status(500).json({ success: false, message: 'Erro ao atualizar coleção.' });
                }

            // ----------------------------------------------------------------------
            // DELETE: Permite exclusão de Coleção ou Item individual
            // ----------------------------------------------------------------------
            case 'DELETE':
                try {
                    // AJUSTE: Usa body para itemId e query para colecaoId para ser mais RESTful
                    const { id: colecaoId } = req.query as { id: string };
                    const { itemId } = req.body as { itemId: string }; 

                    if (itemId) {
                        // Deleta o ColecaoItem (e suas fotos em cascata)
                        await prisma.colecaoItem.delete({ where: { id: itemId } });
                        return res.status(200).json({ success: true, message: 'Item excluído com sucesso.' });
                    }
                    
                    if (!colecaoId) {
                        return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para exclusão.' });
                    }

                    // Exclui a Colecao (e seus itens/fotos em cascata)
                    await prisma.colecao.delete({
                        where: { id: colecaoId },
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