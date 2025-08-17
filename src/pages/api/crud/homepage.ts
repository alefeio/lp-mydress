import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // 1. Obter a sessão do usuário
  const session = await getSession({ req });

  // 2. Verificar se o usuário está autenticado e se é um ADMIN
  if (!session || session.user?.role !== 'ADMIN') {
    return res.status(401).json({ message: 'Acesso não autorizado' });
  }

  // A partir daqui, a requisição está autorizada
  if (req.method === 'POST') {
    try {
      const { sections } = req.body;

      // 3. Deletar todas as sessões existentes
      await prisma.homepageSection.deleteMany({});

      // 4. Salvar as novas sessões com a ordem correta
      const sectionsToSave = sections.map((section: any) => ({
        type: section.type,
        order: section.order,
        content: section.content,
      }));

      await prisma.homepageSection.createMany({
        data: sectionsToSave,
      });

      return res.status(200).json({ message: 'Sessões salvas com sucesso' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Erro ao salvar as sessões' });
    }
  } else if (req.method === 'GET') {
    try {
      // Lógica para obter as sessões (se necessária)
      const sections = await prisma.homepageSection.findMany({
        orderBy: { order: 'asc' },
      });
      return res.status(200).json(sections);
    } catch (error) {
      return res.status(500).json({ message: 'Erro ao buscar as sessões' });
    }
  } else {
    // Método não permitido
    res.setHeader('Allow', ['POST', 'GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}