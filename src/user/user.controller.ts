import { Router, type Request, type Response } from "express";
import { UserService } from "./user.service";

const router = Router();
const userService = new UserService();

router.get("/", async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.get("/search", async (req: Request, res: Response) => {
  try {
    const { q } = req.query;

    if (!q || typeof q !== "string") {
      res.status(400).json({ message: "Query pencarian (q) wajib diisi" });
      return;
    }

    const users = await userService.searchUsers(q);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!id || typeof id !== "string") {
      res.status(400).json({ message: "ID tidak valid" });
      return;
    }

    const user = await userService.getUserById(id);
    res.json(user);
  } catch (err) {
    res.status(404).json({ message: (err as Error).message });
  }
});

router.post("/", async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    const { password: _, ...safeUser } = user;
    res.status(201).json(safeUser);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email dan password wajib diisi" });
      return;
    }

    const user = await userService.validatePassword(email, password);

    const { password: _, ...safeUser } = user;
    res.json(safeUser);
  } catch (err) {
    res.status(401).json({ message: (err as Error).message });
  }
});

export default router;
