import { Router } from "express";
import { CheckoutController } from "../controllers/checkout.controller";

const router = Router();
const checkoutController = new CheckoutController();

router.post("/checkout", (req, res) => checkoutController.checkout(req, res));

export { router as checkoutRoutes };