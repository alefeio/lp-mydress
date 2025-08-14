import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import { IncomingForm } from 'formidable';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const form = new IncomingForm();

  return new Promise((resolve, reject) => {
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erro ao processar formulário:', err);
        return reject(res.status(500).json({ message: 'Erro ao processar o arquivo', error: err }));
      }

      const file = files.file as any;

      if (!file || !file.filepath) {
        return reject(res.status(400).json({ message: 'Nenhum arquivo enviado.' }));
      }

      try {
        const uploadResult = await cloudinary.uploader.upload(file.filepath, {
          folder: 'dresses',
        });
        
        fs.unlinkSync(file.filepath); // Exclui o arquivo temporário após o upload

        resolve(res.status(200).json({ url: uploadResult.secure_url }));
      } catch (uploadErr) {
        console.error('Erro no upload para o Cloudinary:', uploadErr);
        reject(res.status(500).json({ message: 'Erro no upload para o Cloudinary', error: uploadErr }));
      }
    });
  });
}