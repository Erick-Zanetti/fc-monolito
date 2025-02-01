import { Request, Response } from "express";
import CheckoutFacadeFactory from "src/modules/checkout/factory/checkout.facade.factory";


export class CheckoutController {
    async checkout(req: Request, res: Response): Promise<Response> {
        try {
            const facade = CheckoutFacadeFactory.create();
            const checkout = await facade.checkout(req.body);
            return res.status(200).json(checkout);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}