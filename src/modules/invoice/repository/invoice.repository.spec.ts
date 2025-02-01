import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "src/infra/config/database/migrator";
import InvoiceModel from "./invoice.model";
import InvoiceItemModel from "./invoice-item.model";
import InvoiceRepository from "./invoice.repository";
import Invoice from "../domain/invoice.entity";
import Id from "src/modules/@shared/domain/value-object/id.value-object";
import Address from "src/modules/@shared/domain/value-object/address";
import InvoiceItem from "../domain/invoice-item.entity";

describe("InvoiceRepository test", () => {
    let sequelize: Sequelize;
    let migrated: Umzug<Sequelize>;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        models: [
          InvoiceModel,
          InvoiceItemModel,
        ],
      });
      migrated = migrator(sequelize);
      await migrated.up();
    });
  
    afterEach(async () => {
      if (!migrated || !sequelize) {
        return 
      }
      migrated = migrator(sequelize)
      await migrated.down()
      await sequelize.close()
    });
    it("should generate an invoice without items", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "John Doe",
            document: "1234567890",
            address: new Address("123 Main St", "12345", "Apt 1", "New York", "NY", "10001"),
            items: [],
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" } });
        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.name).toBe(invoice.name);
        expect(invoiceDb.document).toBe(invoice.document);
        expect(invoiceDb.street).toBe(invoice.address.street);
        expect(invoiceDb.number).toBe(invoice.address.number);
        expect(invoiceDb.complement).toBe(invoice.address.complement);
        expect(invoiceDb.city).toBe(invoice.address.city);
        expect(invoiceDb.state).toBe(invoice.address.state);
        expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);
    });

    it("should generate an invoice with items", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "John Doe",
            document: "1234567890",
            address: new Address("123 Main St", "12345", "Apt 1", "New York", "NY", "10001"),
            items: [
                new InvoiceItem({
                    id: new Id("1"),
                    name: "Item 1",
                    price: 100,
                }),
            ],
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await InvoiceModel.findOne({ where: { id: "1" }, include: [{ model: InvoiceItemModel, as: "items" }] });
        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.name).toBe(invoice.name);
        expect(invoiceDb.document).toBe(invoice.document);
        expect(invoiceDb.street).toBe(invoice.address.street);
        expect(invoiceDb.number).toBe(invoice.address.number);
        expect(invoiceDb.complement).toBe(invoice.address.complement);
        expect(invoiceDb.city).toBe(invoice.address.city);
        expect(invoiceDb.state).toBe(invoice.address.state);
        expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);
        expect(invoiceDb.items.length).toBe(1);
        expect(invoiceDb.items[0].name).toBe("Item 1");
        expect(invoiceDb.items[0].price).toBe(100);
    });

    it("should find an invoice without items", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "John Doe",
            document: "1234567890",
            address: new Address("123 Main St", "12345", "Apt 1", "New York", "NY", "10001"),
            items: [],
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await repository.find("1");
        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.name).toBe(invoice.name);
        expect(invoiceDb.document).toBe(invoice.document);
        expect(invoiceDb.address.street).toBe(invoice.address.street);
        expect(invoiceDb.address.number).toBe(invoice.address.number);
        expect(invoiceDb.address.complement).toBe(invoice.address.complement);
        expect(invoiceDb.address.city).toBe(invoice.address.city);
        expect(invoiceDb.address.state).toBe(invoice.address.state);
        expect(invoiceDb.address.zipCode).toBe(invoice.address.zipCode);
        expect(invoiceDb.items.length).toBe(0);
    });

    it("should find an invoice with items", async () => {
        const invoice = new Invoice({
            id: new Id("1"),
            name: "John Doe",
            document: "1234567890",
            address: new Address("123 Main St", "12345", "Apt 1", "New York", "NY", "10001"),
            items: [new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 })],
        });

        const repository = new InvoiceRepository();
        await repository.generate(invoice);

        const invoiceDb = await repository.find("1");
        expect(invoiceDb).toBeDefined();
        expect(invoiceDb.items.length).toBe(1);
        expect(invoiceDb.items[0].name).toBe("Item 1");
        expect(invoiceDb.items[0].price).toBe(100);
    });
});
