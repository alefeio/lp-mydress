// src/pages/api/crud/homepage.ts

import { PrismaClient } from "@prisma/client";
import { getSession } from "next-auth/react";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handle(req: NextApiRequest, res: NextApiResponse) {
  // Lógica para lidar com a requisição GET
  if (req.method === "GET") {
    try {
      const sections = await prisma.homepageSection.findMany({
        orderBy: {
          order: 'asc', // Ordena por ordem crescente
        },
      });
      res.status(200).json(sections);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao buscar as sessões da página inicial." });
    }
  }

  // Lógica para lidar com a requisição POST (salvar/atualizar)
  else if (req.method === "POST") {
    const session = await getSession({ req });
    // CORREÇÃO: Adicionamos a verificação para 'session.user'
    if (!session || !session.user || session.user.role !== "ADMIN") {
      res.status(401).json({ message: "Não autorizado." });
      return;
    }

    try {
      const { sections } = req.body;

      if (!Array.isArray(sections)) {
        res.status(400).json({ message: "Dados inválidos. Esperado um array de sessões." });
        return;
      }

      const upsertPromises = sections.map((section: any, index: number) => {
        // Usa `upsert` para criar ou atualizar o registro.
        return prisma.homepageSection.upsert({
          where: { id: section.id || "new" },
          update: {
            type: section.type,
            order: index,
            content: section.content,
          },
          create: {
            id: section.id,
            type: section.type,
            order: index,
            content: section.content,
          },
        });
      });

      await Promise.all(upsertPromises);

      res.status(200).json({ message: "Sessões salvas com sucesso." });
    } catch (error) {
      console.error("Erro ao salvar sessões:", error);
      res.status(500).json({ message: "Erro ao salvar as sessões da página inicial." });
    }
  }

  // Lógica para lidar com a requisição DELETE
  else if (req.method === "DELETE") {
    const session = await getSession({ req });
    // CORREÇÃO: Adicionamos a verificação para 'session.user'
    if (!session || !session.user || session.user.role !== "ADMIN") {
      res.status(401).json({ message: "Não autorizado." });
      return;
    }

    try {
      const { id } = req.query;
      await prisma.homepageSection.delete({
        where: { id: id as string },
      });
      res.status(200).json({ message: "Sessão removida com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Erro ao remover a sessão." });
    }
  }

  else {
    res.setHeader("Allow", ["GET", "POST", "DELETE"]);
    res.status(405).end(`Método ${req.method} não permitido`);
  }
}