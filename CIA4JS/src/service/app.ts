import { PROJECT_PATH } from '../config/config';
import { ParserJavascript } from '../parser/ParserJavascript';
import express, { Request, Response } from "express";
import cors from "cors";

const app = express();

// Sử dụng middleware cors
app.use(cors());

app.post("/api/javascript-service/parse/file", async (req: Request, res: Response) => {
  try {
    const p = new ParserJavascript(PROJECT_PATH);
    return res.json(await p.parser());
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(6060, () => console.log("Server started on port 6060"));