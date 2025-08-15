// src/pages/api/crud/menu.ts

import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Lógica para lidar com a requisição GET
  // Ela busca os dados do menu ao carregar a página
  if (req.method === 'GET') {
    try {
      const menuData = await prisma.menu.findUnique({
        where: { id: 1 },
      });
      return res.status(200).json(menuData);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar menu" });
    }
  }

  // Lógica para lidar com a requisição POST
  // Ela salva os dados do menu no banco de dados
  if (req.method === 'POST') {
    const { logoUrl, links } = req.body;

    // Verifique se os dados estão sendo recebidos corretamente
    console.log('Dados recebidos para salvar o menu:', { logoUrl, links });

    try {
      const updatedMenu = await prisma.menu.upsert({
        where: { id: 1 },
        update: { logoUrl, links },
        create: { id: 1, logoUrl, links },
      });
      return res.status(200).json(updatedMenu);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Erro ao salvar o menu" });
    }
  }

  // Se o método não for GET nem POST, retorna 405
  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}