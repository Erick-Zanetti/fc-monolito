import { Router } from "express";
import { InvoiceController } from "../controllers/invoice.controller";

const router = Router();
const invoiceController = new InvoiceController();

router.get("/invoices/:id", (req, res) => invoiceController.findInvoice(req, res));

export { router as invoiceRoutes };