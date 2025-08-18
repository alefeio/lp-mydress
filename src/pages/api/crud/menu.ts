// src/pages/api/crud/menu.ts
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Lógica para lidar com a requisição GET
  if (req.method === 'GET') {
    try {
      // @ts-ignore
      const menuData = await prisma.menu.findUnique({
        where: { id: 1 },
      });
      return res.status(200).json(menuData);
    } catch (error) {
      return res.status(500).json({ message: "Erro ao buscar menu" });
    }
  }

  // Lógica para lidar com a requisição POST
  if (req.method === 'POST') {
    const { logoUrl, links } = req.body;

    try {
      // @ts-ignore
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

  res.setHeader('Allow', ['GET', 'POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}