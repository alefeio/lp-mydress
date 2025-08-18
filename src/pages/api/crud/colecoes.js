// src/pages/api/crud/colecoes.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Função para gerar o slug a partir de uma string
function slugify(text) {
  return text.toString().toLowerCase()
    .trim()
    .replace(/\s+/g, '-')           // Substitui espaços por hífens
    .replace(/[^\w-]+/g, '')       // Remove todos os caracteres não-palavra
    .replace(/--+/g, '-')          // Substitui múltiplos hífens por um único
    .replace(/^-+/, '')            // Remove hífens do início
    .replace(/-+$/, '');           // Remove hífens do final
}

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // ... (código existente) ...
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
        const { title, subtitle, description, bgcolor, buttonText, buttonUrl, items, colecaoId } = req.body;

        if (colecaoId) {
          if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Dados de itens inválidos.' });
          }
          // Geração do slug para cada item
          const itemsWithSlugs = items.map(item => ({
            ...item,
            slug: slugify(`${item.productMark}-${item.productModel}-${item.cor}`),
          }));
          const createdItems = await prisma.colecaoItem.createMany({
            data: itemsWithSlugs.map(item => ({ ...item, colecaoId })),
          });
          return res.status(201).json({ success: true, data: createdItems });
        } else {
          // Geração do slug para cada item da nova coleção
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
              buttonUrl, // Adicionado campo buttonUrl
              items: {
                create: itemsWithSlugs, // Usando os itens com slugs gerados
              },
            },
            include: {
              items: true,
            },
          });
          return res.status(201).json({ success: true, data: createdColecao });
        }
      } catch (error) {
        console.error('Erro ao criar coleção ou item:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
      }

    case 'PUT':
      // O slug também pode ser atualizado se necessário, mas geralmente é imutável
      try {
        const { id, ...data } = req.body;

        if (data.productMark || data.productModel || data.cor || data.img) {
          // Se o item for atualizado, o slug também é atualizado com base nos novos dados
          if (data.productMark || data.productModel || data.cor) {
             data.slug = slugify(`${data.productMark}-${data.productModel}-${data.cor}`);
          }
          const updatedItem = await prisma.colecaoItem.update({
            where: { id },
            data,
          });
          return res.status(200).json({ success: true, data: updatedItem });
        } else {
          const updatedColecao = await prisma.colecao.update({
            where: { id },
            data,
          });
          return res.status(200).json({ success: true, data: updatedColecao });
        }
      } catch (error) {
        console.error('Erro ao atualizar:', error);
        return res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
      }

    case 'DELETE':
      // ... (código existente) ...
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