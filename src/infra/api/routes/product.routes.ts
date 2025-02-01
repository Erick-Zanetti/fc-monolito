import { Router } from "express";
import { ProductController } from "../controllers/product.controller";

const router = Router();
const productController = new ProductController();

router.post("/products", (req, res) => productController.addProduct(req, res));
router.get("/products/check-stock/:productId", (req, res) => productController.checkStock(req, res));

export { router as productRoutes };