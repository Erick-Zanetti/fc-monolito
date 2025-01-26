import Id from "src/modules/@shared/domain/value-object/id.value-object";
import Address from "src/modules/@shared/domain/value-object/address";
import Invoice from "../../domain/invoice.entity";
import InvoiceItem from "../../domain/invoice-item.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const invoice = new Invoice({
    id: new Id("1"),
    name: "John Doe",
    document: "1234567890",
    address: new Address("123 Main St", "12345", "Apt 1", "New York", "NY", "10001"),
    items: [new InvoiceItem({ id: new Id("1"), name: "Item 1", price: 100 })],
});

const MockRepository = () => {
    return {
        find: jest.fn().mockResolvedValue(invoice),
        generate: jest.fn(),
    };
};

describe("Find invoice usecase unit test", () => {
    it("should find an invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new FindInvoiceUseCase(invoiceRepository);
        const input = { id: "1" };
        const result = await usecase.execute(input);
        expect(result.id).toBe("1");
        expect(result.name).toBe("John Doe");
        expect(result.document).toBe("1234567890");
        expect(result.address).toBe(invoice.address);
        expect(result.total).toBe(100);
        expect(result.createdAt).toBe(invoice.createdAt);
        expect(result.items.length).toBe(1);
        expect(result.items[0].id).toBe("1");
        expect(result.items[0].name).toBe("Item 1");
        expect(result.items[0].price).toBe(100);
    });
});