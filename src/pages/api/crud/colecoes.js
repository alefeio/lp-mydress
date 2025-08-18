// src/pages/api/crud/colecoes.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para gerar o slug a partir de uma string
function slugify(text) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      try {
        const colecoes = await prisma.colecao.findMany({
          include: {
            items: true,
          },
          orderBy: {
            title: 'asc',
          },
        });
        return res.status(200).json({ success: true, colecoes });
      } catch (error) {
        console.error('Erro ao buscar coleções:', error);
        return res.status(500).json({ success: false, message: 'Erro ao buscar coleções.' });
      }

    case 'POST':
      try {
        const { title, subtitle, description, bgcolor, buttonText, buttonUrl, items } = req.body;
        
        const itemsWithSlugs = (items || []).map(item => ({
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
        const { id, items, ...rest } = req.body;

        if (!id) {
            return res.status(400).json({ success: false, message: 'ID da coleção é obrigatório para atualização.' });
        }

        const updatedColecao = await prisma.colecao.update({
            where: { id },
            data: {
                ...rest,
            },
        });

        if (items && Array.isArray(items)) {
          // Lógica para sincronizar os itens (atualizar existentes, criar novos)
          const transaction = items.map(item => {
              if (item.id) {
                  // Se o item tem ID, ele já existe e pode ser atualizado
                  return prisma.colecaoItem.update({
                      where: { id: item.id },
                      data: {
                          productMark: item.productMark,
                          productModel: item.productModel,
                          cor: item.cor,
                          img: item.img,
                          slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
                      },
                  });
              } else {
                  // Se não tem ID, é um novo item para esta coleção
                  return prisma.colecaoItem.create({
                      data: {
                          ...item,
                          colecaoId: id,
                          slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
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

    case 'DELETE':
      try {
        const { id, isItem } = req.body;
        
        if (isItem) {
          await prisma.colecaoItem.delete({
            where: { id },
          });
          return res.status(200).json({ success: true, message: 'Item excluído com sucesso.' });
        } else {
          await prisma.colecao.delete({
            where: { id },
          });
          return res.status(200).json({ success: true, message: 'Coleção e seus itens excluídos com sucesso.' });
        }
      } catch (error) {
        console.error('Erro ao excluir:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
      }

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
  }
}