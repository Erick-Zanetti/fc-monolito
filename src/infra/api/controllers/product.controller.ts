import { Request, Response } from "express";
import ProductAdmFacadeFactory from "src/modules/product-adm/factory/facade.factory";

export class ProductController {
    async addProduct(req: Request, res: Response): Promise<Response> {
        try {
            const facade = ProductAdmFacadeFactory.create();
            const product = await facade.addProduct(req.body);
            return res.status(201).json(product);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async checkStock(req: Request, res: Response): Promise<Response> {
        try {
            const facade = ProductAdmFacadeFactory.create();
            const stock = await facade.checkStock({
                productId: req.params.productId
            });
            return res.status(200).json(stock);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}