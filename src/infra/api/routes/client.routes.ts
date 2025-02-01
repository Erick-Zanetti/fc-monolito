import { Router } from "express";
import { ClientController } from "../controllers/client.controller";

const router = Router();
const clientController = new ClientController();

router.post("/clients", (req, res) => clientController.addClient(req, res));
router.get("/clients/:id", (req, res) => clientController.findClient(req, res));

export { router as clientRoutes };