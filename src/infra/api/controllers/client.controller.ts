import { Request, Response } from "express";
import ClientAdmFacadeFactory from "src/modules/client-adm/factory/client-adm.facade.factory";

export class ClientController {

    async addClient(req: Request, res: Response): Promise<Response> {
        try {
            const facade = ClientAdmFacadeFactory.create();
            const client = await facade.add(req.body);
            return res.status(201).json(client);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }

    async findClient(req: Request, res: Response): Promise<Response> {
        try {
            const facade = ClientAdmFacadeFactory.create();
            const client = await facade.find({ id: req.params.id });
            if (!client) {
                return res.status(404).json({ message: "Client not found" });
            }
            return res.status(200).json(client);
        } catch (error: any) {
            return res.status(400).json({ error: error.message });
        }
    }
}
