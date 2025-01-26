import Id from "src/modules/@shared/domain/value-object/id.value-object";
import Address from "src/modules/@shared/domain/value-object/address";
import Invoice from "../../domain/invoice.entity";
import InvoiceItem from "../../domain/invoice-item.entity";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn()
    };
};

describe("Generate invoice usecase unit test", () => {
    it("should generate an invoice", async () => {
        const invoiceRepository = MockRepository();
        const usecase = new GenerateInvoiceUseCase(invoiceRepository);
        const input = {
            name: "John Doe",
            document: "1234567890",
            street: "123 Main St",
            number: "12345",
            complement: "Apt 1",
            city: "New York",
            state: "NY",
            zipCode: "10001",
            items: [{ id: "1", name: "Item 1", price: 100 }],
        };

        const result = await usecase.execute(input);

        expect(result.id).toBeDefined();
        expect(result.name).toBe("John Doe");
        expect(result.document).toBe("1234567890");
        expect(result.street).toBe("123 Main St");
        expect(result.number).toBe("12345");
        expect(result.complement).toBe("Apt 1");
        expect(result.city).toBe("New York");
        expect(result.state).toBe("NY");
        expect(result.zipCode).toBe("10001");
        expect(result.items.length).toBe(1);
        expect(result.items[0].id).toBe("1");
        expect(result.items[0].name).toBe("Item 1");
        expect(result.items[0].price).toBe(100);
        expect(result.total).toBe(100);
    });
});
