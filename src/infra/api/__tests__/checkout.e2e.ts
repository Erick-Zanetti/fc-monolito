import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { setupDB } from "src/infra/config/database";
import { app } from "src/infra/http/express";

async function createClient() {
    const response = await request(app).post("/api/clients").send({
        name: "Client 1",
        email: "client1@email.com",
        document: "1234567890",
        address: {
            street: "Street 1",
            number: "123",
            complement: "Complement 1",
            city: "City 1",
            state: "State 1",
            zipCode: "1234567890",
        }
    });
    return response.body;
}

async function createProduct(productName: string, productDescription: string, productPurchasePrice: number, productStock: number) {
    const response = await request(app).post("/api/products").send({
        name: productName,
        description: productDescription,
        purchasePrice: productPurchasePrice,
        stock: productStock,
    });
    return response.body;
}

describe("Checkout API", () => {
    let sequelize: Sequelize;
    
    beforeAll(async () => {
        sequelize = await setupDB();
    });
    
    afterAll(async () => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        await sequelize.close();
    });

    it("E2E should create a checkout approved with 2 products", async () => {
        const client = await createClient();
        const product1 = await createProduct("Product 1", "Product 1 description", 100, 10);
        const product2 = await createProduct("Product 2", "Product 2 description", 200, 20);

        const response = await request(app).post("/api/checkout").send({
            clientId: client.id,
            products: [
                { productId: product1.id },
                { productId: product2.id },
            ],
        });

        expect(response.status).toBe(200);
        expect(response.body.total).toBe(600);
        expect(response.body.invoiceId).toBeDefined();
        expect(response.body.status).toBe("approved");
    });

    it("E2E should create a checkout declined with 2 products", async () => {
        const client = await createClient();
        const product1 = await createProduct("Product 1", "Product 1 description", 1, 10);
        const product2 = await createProduct("Product 2", "Product 2 description", 2, 20);

        const response = await request(app).post("/api/checkout").send({
            clientId: client.id,
            products: [
                { productId: product1.id },
                { productId: product2.id },
            ],
        });

        expect(response.status).toBe(200);
        expect(response.body.total).toBe(6);
        expect(response.body.invoiceId).toBeNull();
        expect(response.body.status).toBe("declined");
    });
});
