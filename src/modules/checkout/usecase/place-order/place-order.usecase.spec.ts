import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe("PlaceOrderUseCase unit test", () => {

    describe("check if validateProducts is working", () => {
        let placeOrderUseCase: PlaceOrderUseCase;
        
        beforeEach(() => {
            //@ts-expect-error
            placeOrderUseCase = new PlaceOrderUseCase();;
        });

        it("Should throw an error if no products selected", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [],
            };
            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow("No products selected");
        });
        
        it("Should throw an error if product not found", async () => {

            const mockProductFacade = {
                checkStock: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "0" }],
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(`Product ${input.products[0].productId} not found`);
        });
        
        it("Should throw an error if product is not available in stock", async () => {

            const mockProductFacade = {
                checkStock: jest.fn().mockResolvedValue({ productId: "0", stock: 0 }),
            };

            //@ts-expect-error
            placeOrderUseCase["_productFacade"] = mockProductFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "0" }],
            };

            await expect(placeOrderUseCase["validateProducts"](input)).rejects.toThrow(`Product ${input.products[0].productId} is not available in stock`);
        });
    });

    describe("check if getProduct is working", () => {
        const mockDate = new Date("2025-01-01");
        let placeOrderUseCase: PlaceOrderUseCase;

        beforeAll(() => {
            jest.useFakeTimers("modern");
            jest.setSystemTime(mockDate);
            //@ts-expect-error
            placeOrderUseCase = new PlaceOrderUseCase();
        });

        afterAll(() => {
            jest.useRealTimers();
        });

        it("Should return a product", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue({ id: "0", name: "Product 0", description: "Product 0 description", salesPrice: 10 }),
            };

            //@ts-expect-error
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "0" }],
            };

            const product = await placeOrderUseCase["getProduct"](input.products[0].productId);
            expect(mockCatalogFacade.find).toHaveBeenCalledWith({ id: input.products[0].productId });
            expect(product).toBeDefined();
            expect(product.id.id).toBe("0");
            expect(product.name).toBe("Product 0");
            expect(product.description).toBe("Product 0 description");
            expect(product.salesPrice).toBe(10);
        });

        it("Should throw an error if product not found", async () => {
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error
            placeOrderUseCase["_catalogFacade"] = mockCatalogFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "0" }],
            };

            await expect(placeOrderUseCase["getProduct"](input.products[0].productId)).rejects.toThrow("Product not found");
        });
    });

    describe("validate client", () => {
        it("Should throw an error if client not found", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(null),
            };

            //@ts-expect-error
            const placeOrderUseCase = new PlaceOrderUseCase();

            //@ts-expect-error
            placeOrderUseCase["_clientFacade"] = mockClientFacade;

            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "0" }],
            };

            await expect(placeOrderUseCase.execute(input)).rejects.toThrow("Client not found");
        });
    });

    describe("place an order", () => {
        const clientProps = {
            id: "0",
            name: "Client 0",
            email: "client0@email.com",
            document: "0",
            address: {
                street: "0",
                number: "0",
                complement: "0",
                city: "0",
                state: "0",
                zipCode: "0",
            },
        }

        const mockClientFacade = { find: jest.fn().mockResolvedValue(clientProps) };

        const mockProductFacade = { checkStock: jest.fn() };

        const mockPaymentFacade = { process: jest.fn() };

        const mockCatalogFacade = { find: jest.fn() };

        const mockInvoiceFacade = { generate: jest.fn() };

        const mockRepository = { addOrder: jest.fn() };

        let placeOrderUseCase: PlaceOrderUseCase;

        beforeAll(() => {
            //@ts-expect-error
            placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockPaymentFacade, mockCatalogFacade, mockInvoiceFacade, mockRepository);
        });

        it("Should place an order with payment approved", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }],
            };

            mockProductFacade.checkStock.mockImplementation(({ productId }: { productId: string }) => {
                if (productId === "0") {
                    return { productId: "0", stock: 10 };
                }
                if (productId === "1") {
                    return { productId: "1", stock: 1 };
                }
                return null;
            });
            mockCatalogFacade.find.mockImplementation(({ id }: { id: string }) => {
                if (id === "0") {
                    return { id: "0", name: "Product 0", description: "Product 0 description", salesPrice: 10 };
                }
                if (id === "1") {
                    return { id: "1", name: "Product 1", description: "Product 1 description", salesPrice: 20 };
                }
                return null;
            });
            mockPaymentFacade.process.mockResolvedValue({ status: "approved" });
            mockInvoiceFacade.generate.mockResolvedValue({ id: "0" });

            const output = await placeOrderUseCase.execute(input);

            expect(output).toBeDefined();
            expect(output.total).toBe(30);
            expect(output.invoiceId).toBe("0");
            expect(output.status).toBe("approved");
            
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(2);
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(2);
            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(1);
            expect(mockRepository.addOrder).toHaveBeenCalledTimes(1);
        });

        it("Should place an order with payment rejected", async () => {
            const input: PlaceOrderInputDto = {
                clientId: "0",
                products: [{ productId: "0" }, { productId: "1" }],
            };
            
            mockProductFacade.checkStock.mockImplementation(({ productId }: { productId: string }) => {
                if (productId === "0") {
                    return { productId: "0", stock: 10 };
                }
                if (productId === "1") {
                    return { productId: "1", stock: 1 };
                }
                return null;
            });
            mockCatalogFacade.find.mockImplementation(({ id }: { id: string }) => {
                if (id === "0") {
                    return { id: "0", name: "Product 0", description: "Product 0 description", salesPrice: 10 };
                }
                if (id === "1") {
                    return { id: "1", name: "Product 1", description: "Product 1 description", salesPrice: 20 };
                }
                return null;
            });
            mockPaymentFacade.process.mockResolvedValue({ status: "rejected" });
            mockInvoiceFacade.generate.mockResolvedValue({ id: "0" });

            const output = await placeOrderUseCase.execute(input);

            
            expect(output).toBeDefined();
            expect(output.total).toBe(30);
            expect(output.invoiceId).toBeNull();
            expect(output.status).toBe("rejected");
            
            expect(mockProductFacade.checkStock).toHaveBeenCalledTimes(2);
            expect(mockCatalogFacade.find).toHaveBeenCalledTimes(2);
            expect(mockPaymentFacade.process).toHaveBeenCalledTimes(1);
            expect(mockInvoiceFacade.generate).toHaveBeenCalledTimes(0);
            expect(mockRepository.addOrder).toHaveBeenCalledTimes(1);
        });
    });
});