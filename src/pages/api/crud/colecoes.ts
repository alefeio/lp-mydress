import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import { ColecaoProps, ColecaoItem } from '../../../types'; 
// OBS: Você precisará garantir que 'types.ts' reflita os novos campos: 
// ColecaoItem deve ter 'ordem: number | undefined' e 'fotos: ColecaoItemFoto[] | undefined'
// ColecaoItemFoto deve ser um tipo que inclua id, url, caption, ordem, like, view.

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

// O tipo auxiliar foi removido, pois a tipagem é melhor inferida pelo Prisma no map.


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
                                // CORRIGIDO: Ordena por 'ordem' (prioridade) e depois por 'like'
                                orderBy: [
                                    { ordem: 'asc' }, 
                                    { like: 'desc' }, 
                                ],
                                select: { 
                                    id: true,
                                    productMark: true,
                                    productModel: true,
                                    cor: true,
                                    img: true,
                                    slug: true,
                                    colecaoId: true,
                                    size: true,
                                    price: true,
                                    price_card: true,
                                    like: true, 
                                    view: true, 
                                    ordem: true, // INCLUÍDO: Campo 'ordem'
                                    fotos: { // INCLUÍDO: Relação ColecaoItemFoto
                                        orderBy: { ordem: 'asc' }, 
                                        select: {
                                            id: true,
                                            url: true,
                                            caption: true,
                                            ordem: true,
                                            like: true,
                                            view: true,
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

                    // Recria o slug dinamicamente (para Colecao e ColecaoItem)
                    const colecoesComSlugs: ColecaoProps[] = colecoes.map((colecao: any) => ({
                        ...colecao,
                        slug: slugify(colecao.title), // Colecao não tem slug no DB
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
                            order,
                            items: {
                                // Mapeia os itens e prepara para criação aninhada
                                create: (items || []).map((item: ColecaoItem) => ({ 
                                    productMark: item.productMark,
                                    productModel: item.productModel,
                                    cor: item.cor,
                                    img: item.img as string, 
                                    ordem: item.ordem ?? 0, // NOVO: Campo ordem
                                    slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                                    size: item.size,
                                    price: item.price,
                                    price_card: item.price_card,
                                    like: item.like ?? 0, 
                                    view: item.view ?? 0, 
                                    fotos: { // NOVO: Criação aninhada das fotos (ColecaoItemFoto)
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

                    // 1. Atualiza a coleção principal
                    await prisma.colecao.update({
                        where: { id },
                        data: restColecao,
                    });

                    // 2. Transação para CRUD dos ColecaoItem e ColecaoItemFoto
                    if (items && Array.isArray(items)) {
                        const transaction = items.map((item: ColecaoItem) => {
                            const itemSlug = slugify(`${item.productMark}-${item.productModel}-${item.cor}`);

                            // Dados base para o ColecaoItem (sem a relação 'fotos')
                            const baseItemData = {
                                productMark: item.productMark,
                                productModel: item.productModel,
                                cor: item.cor,
                                img: item.img as string,
                                slug: itemSlug,
                                ordem: item.ordem ?? 0, // NOVO: Campo ordem
                                size: item.size,
                                price: item.price,
                                price_card: item.price_card,
                                like: item.like ?? 0,
                                view: item.view ?? 0,
                            };

                            // --- Item Existente: Update (com upsert de fotos) ---
                            if (item.id) {
                                return prisma.colecaoItem.update({
                                    where: { id: item.id },
                                    data: {
                                        ...baseItemData,
                                        fotos: {
                                            // NOVO: Usa UPSERT para gerenciar fotos existentes/novas (ColecaoItemFoto)
                                            upsert: item.fotos?.map(foto => ({
                                                where: { id: foto.id || 'non-existent-id' }, // Se não tem ID, 'create' é usado
                                                create: {
                                                    url: foto.url as string,
                                                    caption: foto.caption,
                                                    ordem: foto.ordem ?? 0,
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
                            // --- Item Novo: Create (com create de fotos) ---
                            else {
                                return prisma.colecaoItem.create({
                                    data: {
                                        ...baseItemData,
                                        colecaoId: id,
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
            // DELETE: Permite exclusão de Coleção ou Item individual
            // ----------------------------------------------------------------------
            case 'DELETE':
                try {
                    const { id } = req.query as { id: string };
                    const { itemId } = req.body as { itemId: string }; // ID do item individual a ser excluído

                    if (itemId) {
                        // Se 'itemId' for fornecido, deleta o ColecaoItem (e suas fotos em cascata)
                        await prisma.colecaoItem.delete({ where: { id: itemId } });
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