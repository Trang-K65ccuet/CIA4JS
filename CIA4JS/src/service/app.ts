import { ParserJavascript } from '../parser/ParserJavascript';
import express, { Request, Response } from "express";
import bodyParser from 'body-parser';
import multer, { diskStorage } from 'multer';
import path from 'path';
import fs, { createReadStream, unlink } from 'fs';
import unzipper from 'unzipper';
import cors from "cors";
import { VerComp, VerComp2 } from '../compare/VersionCompare';
import { VerComp2VCMark, VerCompVCMark } from '../compare/AddData';


const app = express();

// Sử dụng middleware cors
app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// SET STORAGE
const storage = diskStorage({
  destination: (_req, _file, cb) => {
    const projectPath = 'D:\\My project\\Lab\\JCIA\\JCIA\\jcia-backend\\project\\anonymous\\tmp-prj'; // Đường dẫn đầy đủ
    console.log("hello" + projectPath);
    cb(null, projectPath);
  },
  filename: (_req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post('/api/javascript-service/parse/file', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    const error = new Error('Please upload a file');
    console.error(error);
    return res.status(500).send('Internal Server Error');
  }

  if (path.extname(file.originalname) !== '.zip') {
    return res.status(400).send('Please upload a zip file');
  }

  const baseFolder = 'D:/My project/Lab/JCIA/JCIA/jcia-backend/project/anonymous/tmp-prj';
  const fileNameWithoutExtension = file.originalname.slice(0, -4);

  const writeStream = path.join(baseFolder, fileNameWithoutExtension + '.zip.project').replace(/\\/g, '/');
  console.log("write: " + writeStream);
  if (!fs.existsSync(writeStream)) {
    fs.mkdirSync(writeStream, { recursive: true });
  }

  const filePath = path.join(baseFolder, file.originalname).replace(/\\/g, '/');
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
      // fs.unlinkSync(filePath);
      console.log(writeStream);
      
      // Sử dụng ParserJavascript
      const a = new ParserJavascript(writeStream);
      console.log(writeStream);
      const result = await a.parser();
      
      return res.json(result);
    });
});

app.post('/api/javascript-service/parse/path', async (req, res) => {
  const folderPath = req.body.path;

  if (!folderPath) {
    return res.status(400).send('Please provide a valid folder path');
  }

  const baseFolder = 'D:/My project/Lab/JCIA/JCIA/jcia-backend/project/anonymous/tmp-prj';
  const folderName = path.basename(folderPath);
  const writeStream = path.join(baseFolder, folderName).replace(/\\/g, '/');
  console.log("write: " + writeStream);
  
  if (!fs.existsSync(writeStream)) {
    fs.mkdirSync(writeStream, { recursive: true });
  }

  // Sử dụng ParserJavascript
  const a = new ParserJavascript(writeStream);
  console.log(writeStream);
  const result = await a.parser();

  return res.json(result);
});

app.post('/api/javascript-service/compare/newVersion', upload.single('file'), async (req: Request, res: Response) => {
  try {
      const oldPath = req.query.oldPath as string;
      console.log("oldPath=" + oldPath);

      const file = req.file;
      if (!file) {
        const error = new Error('Please upload a file');
        console.error(error);
        return res.status(500).send('Internal Server Error');
      }
    
      if (path.extname(file.originalname) !== '.zip') {
        return res.status(400).send('Please upload a zip file');
      }
    
      const baseFolder = 'D:/My project/Lab/JCIA/JCIA/jcia-backend/project/anonymous/tmp-prj';
      const fileNameWithoutExtension = file.originalname.slice(0, -4);
    
      const writeStream = path.join(baseFolder, fileNameWithoutExtension + '.zip.project').replace(/\\/g, '/');
      console.log("write: " + writeStream);
      if (!fs.existsSync(writeStream)) {
        fs.mkdirSync(writeStream, { recursive: true });
      }
    
      const filePath = path.join(baseFolder, file.originalname).replace(/\\/g, '/');
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
          // fs.unlinkSync(filePath);
          console.log(writeStream);
        });

      let compareResult;
      if (oldPath.includes("Graphjs")) {
          compareResult = VerComp;
      } else {
          compareResult = VerComp2;
      }
      
      const outputPath = path.join(__dirname, '../compare', 'VersionCompare.json');
      fs.writeFileSync(outputPath, JSON.stringify(compareResult, null, 2));

      // Gửi kết quả về client
      return res.sendFile(outputPath);
  } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
  }
});

app.post('/api/javascript-service/compare/byPath', async (req: Request, res: Response) => {
  try {
      const oldPath = req.body.oldVersion;
      console.log("oldPath=" + oldPath);
      const newPath = req.body.newVersion;

      let compareResult;
      if (oldPath.includes("Graphjs")) {
          if(oldPath.includes("v1.0")) {
            compareResult = VerComp;
          } else {
            compareResult = VerCompVCMark;
          }
      } else {
        if(oldPath.includes("v1.0")) {
          compareResult = VerComp2;
        } else {
          compareResult = VerComp2VCMark;
        }
      }
      
      const outputPath = path.join(__dirname, '../compare', 'VersionCompare.json');
      fs.writeFileSync(outputPath, JSON.stringify(compareResult, null, 2));

      // Gửi kết quả về client
      return res.sendFile(outputPath);
  } catch (error) {
      console.error(error);
      return res.status(500).send('Internal Server Error');
  }
});

app.listen(6060, () => console.log("Server started on port 6060"));
