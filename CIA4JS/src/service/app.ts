import { ParserJavascript } from '../parser/ParserJavascript';
import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import multer, { diskStorage } from 'multer';
import path from 'path';
import fs, { createReadStream, unlink } from 'fs';
import unzipper from 'unzipper';
import cors from "cors";

const app = express();

// Sử dụng middleware cors
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

// SET STORAGE
const storage = diskStorage({
  destination: (_req, _file, cb) => {
    // Thay đổi đường dẫn lưu trữ thành đường dẫn của dự án hiện tại + path
    const projectPath = path.join(__dirname, '../../project'); // Đường dẫn của dự án hiện tại
    console.log("hello" +projectPath);
    cb(null, projectPath);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/api/javascript-service/parse/file', upload.single('file'), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }

  if (path.extname(file.originalname) !== '.zip') {
    return res.status(400).send('Please upload a zip file');
  }

  const writeStream = path.join(__dirname, '../../project', file.originalname.slice(0, -4)).replace(/\\/g, '/');
  //console.log(file.originalname)
  if (!fs.existsSync(writeStream)) {
    fs.mkdirSync(writeStream, { recursive: true });
  }

  const filePath = path.join(__dirname, '../../project', file.originalname).replace(/\\/g, '/');
  const readStream = createReadStream(filePath);
  readStream
  .on('error', (err) => {
    console.error(err);
    return res.status(500).send('Error occurred during file read');
  })
  .pipe(unzipper.Extract({ path: writeStream }))
  .on('error', (err) => {
    console.error(err);
    return res.status(500).send('Error occurred during file extraction');
  })
  .on('close', async () => {
    //fs.unlinkSync(filePath);
    console.log(writeStream)
    var a = new ParserJavascript(writeStream);
    const result = await a.parser();
    return res.json(result);
  });
});

app.listen(6060, () => console.log("Server started on port 6060"));
