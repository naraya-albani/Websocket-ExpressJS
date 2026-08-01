import express, { type Request, type Response } from "express";
import { createServer } from "http";
import userController from "./src/user/user.controller";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("Hello from Express!");
});

app.use("/users", userController);

const server = createServer(app);

server.listen(PORT, () => {
  console.log(`Server jalan di http://localhost:${PORT}`);
});
