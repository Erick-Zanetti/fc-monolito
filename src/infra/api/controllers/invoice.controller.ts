import { Request, Response } from "express";
import InvoiceFacadeFactory from "src/modules/invoice/factory/invoice.facade.factory";

export class InvoiceController {

    async findInvoice(req: Request, res: Response): Promise<Response> {
        try {
            const facade = InvoiceFacadeFactory.create();
            const invoice = await facade.find({ id: req.params.id });
            if (!invoice) {
                return res.status(404).json({ message: "Invoice not found" });
            }
            return res.status(200).json(invoice);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
