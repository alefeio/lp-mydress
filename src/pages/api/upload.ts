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

  const busboy = Busboy({ headers: req.headers });
  let uploadFinished = false;

  busboy.on('file', (_fieldname: string, file: Readable, _filename: string) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'dresses' },
      (error, result) => {
        if (error) {
          res.status(500).json({ message: 'Erro ao fazer upload para o Cloudinary', error });
        } else {
          res.status(200).json({ url: result?.secure_url });
        }
        uploadFinished = true;
      }
    );
    file.pipe(stream);
  });

  req.pipe(busboy);

  req.on('close', () => {
    if (!uploadFinished) {
      res.status(500).json({ message: 'Conexão interrompida antes do upload ser concluído' });
    }
  });
}