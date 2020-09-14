import path from 'path';
import crypto from 'crypto';
import multer from 'multer';

const tmpfolder = path.resolve(__dirname, '..', '..', 'tmp');

export default {
  tmpfolder,
  uploadsFolder: path.resolve(tmpfolder, 'uploads'),

  storage: multer.diskStorage({
    //__dirname: Caminho até a pasta config
    destination: tmpfolder,
    filename(request, file, callback){
      const fileHash = crypto.randomBytes(10).toString('HEX');
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};