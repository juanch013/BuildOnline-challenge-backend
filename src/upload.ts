import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: "./images",
    filename: (req, file, cb) => {
      const name = req.body.name;
        const ext = path.extname(file.originalname);
        cb(null, `${name}${ext}`);
    },
  });
  
  const fileFilter = (req: Express.Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.mimetype)) {
      cb(new Error('The image must be of one of the following formats: jpeg, jpg, png'));
    } else {
      cb(null, true);
    }
  };
  
  export const upload = multer({ storage, fileFilter });
