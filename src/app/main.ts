import { Request, Response } from "express";
import dotenv from "dotenv";
import express from "express";

import bot from "./bot";

const app = express();
dotenv.config();

app.get("/", (req: Request, res: Response) => {
  const client = bot();
  res.send(`
                  <html>
                    <body>
                        <p>Mr Vote</p>
                    </body>
                  </html>
            `);
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Started on port http://localhost:${process.env.PORT || "3000"}`);
});
