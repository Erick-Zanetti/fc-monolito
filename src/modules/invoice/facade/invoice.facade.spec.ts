import { Sequelize } from "sequelize-typescript";
import InvoiceItemModel from "../repository/invoice-item.model";
import InvoiceModel from "../repository/invoice.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { FindInvoiceFacadeInputDto, GenerateInvoiceFacadeInputDto } from "./facade.interface";
import InvoiceRepository from "../repository/invoice.repository";
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase";
import InvoiceFacade from "./invoice.facade";

describe("InvoiceFacade test", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        sync: { force: true },
      });
  
      await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
      await sequelize.sync();
    });
  
    afterEach(async () => {
      await sequelize.close();
    });

    it("should generate an invoice", async () => {
        // const repository = new InvoiceRepository();
        // const usecase = new GenerateInvoiceUseCase(repository);
        // const facade = new InvoiceFacade(usecase, null);

        const facade = InvoiceFacadeFactory.create();

        const input: GenerateInvoiceFacadeInputDto = {
            name: "John Doe",
            document: "1234567890",
            street: "123 Main St",
            number: "123",
            complement: "Apt 1",
            city: "New York",
            state: "NY",
            zipCode: "1234567890",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                }
            ]
        }

        await facade.generate(input);

        const invoice = await InvoiceModel.findOne({include: [{ model: InvoiceItemModel }] });

        expect(invoice).toBeDefined();
        expect(invoice?.name).toBe(input.name);
        expect(invoice?.document).toBe(input.document);
        expect(invoice?.street).toBe(input.street);
        expect(invoice?.number).toBe(input.number);
        expect(invoice?.complement).toBe(input.complement);
        expect(invoice?.city).toBe(input.city);
        expect(invoice?.state).toBe(input.state);
        expect(invoice?.zipCode).toBe(input.zipCode);
        expect(invoice?.items.length).toBe(input.items.length);
        expect(invoice?.items[0].name).toBe(input.items[0].name);
        expect(invoice?.items[0].price).toBe(input.items[0].price);
    })

    it("should find an invoice", async () => {

        
        const facade = InvoiceFacadeFactory.create();

        const inputGenerate: GenerateInvoiceFacadeInputDto = {
            name: "John Doe",
            document: "1234567890",
            street: "123 Main St",
            number: "123",
            complement: "Apt 1",
            city: "New York",
            state: "NY",
            zipCode: "1234567890",
            items: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 100,
                }
            ]
        }

        const invoice = await facade.generate(inputGenerate);


        const input: FindInvoiceFacadeInputDto = {
            id: invoice.id,
        }

        const output = await facade.find(input);

        expect(output.id).toBe(input.id);
    })
})
