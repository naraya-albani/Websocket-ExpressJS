import express, { type Request, type Response } from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express!");
});

app.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
