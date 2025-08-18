// src/pages/api/crud/colecoes.js

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'POST':
      // Criar uma nova coleção ou um novo item
      try {
        const { title, subtitle, description, bgcolor, buttonText, items, colecaoId } = req.body;

        if (colecaoId) {
          // Lógica para criar um novo item em uma coleção existente
          if (!items || !Array.isArray(items)) {
            return res.status(400).json({ success: false, message: 'Dados de itens inválidos.' });
          }
          const createdItems = await prisma.colecaoItem.createMany({
            data: items.map(item => ({ ...item, colecaoId })),
          });
          return res.status(201).json({ success: true, data: createdItems });
        } else {
          // Lógica para criar uma nova coleção com itens
          const createdColecao = await prisma.colecao.create({
            data: {
              title,
              subtitle,
              description,
              bgcolor,
              buttonText,
              items: {
                create: items || [],
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
      // Atualizar uma coleção ou um item
      try {
        const { id, ...data } = req.body;

        if (data.productMark || data.productModel || data.cor) {
          // Atualizar um item específico
          const updatedItem = await prisma.colecaoItem.update({
            where: { id },
            data,
          });
          return res.status(200).json({ success: true, data: updatedItem });
        } else {
          // Atualizar a coleção
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
      // Excluir uma coleção ou um item
      try {
        const { id, isItem } = req.body;

        if (isItem) {
          // Excluir um item
          await prisma.colecaoItem.delete({
            where: { id },
          });
          return res.status(200).json({ success: true, message: 'Item excluído com sucesso.' });
        } else {
          // Excluir uma coleção e todos os seus itens
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
      res.setHeader('Allow', ['POST', 'PUT', 'DELETE']);
      res.status(405).end(`Método ${method} não permitido`);
  }
}