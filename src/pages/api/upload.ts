import { NextApiRequest, NextApiResponse } from 'next';
import { v2 as cloudinary } from 'cloudinary';
import Busboy from 'busboy';
import { Readable } from 'stream';

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

export default function upload(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  return new Promise((resolve, reject) => {
    const busboy = Busboy({ headers: req.headers });

    busboy.on('file', (_fieldname, file: Readable, _filename) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'dresses' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve(result);
        }
      );
      file.pipe(stream);
    });

    req.on('close', () => {
      reject(new Error('Conexão interrompida antes do upload ser concluído'));
    });

    busboy.on('error', (err) => {
      reject(err);
    });

    busboy.on('finish', () => {
      // Esta função é chamada quando o Busboy termina de processar o formulário.
      // A promise já foi resolvida ou rejeitada na função 'file'.
    });

    req.pipe(busboy);
  })
  .then((result: any) => {
    res.status(200).json({ url: result?.secure_url });
  })
  .catch((error: any) => {
    console.error('Erro na API de upload:', error);
    res.status(500).json({ message: error.message || 'Erro interno do servidor', error });
  });
}