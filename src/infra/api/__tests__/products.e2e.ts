import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { setupDB } from "src/infra/config/database";
import { app } from "src/infra/http/express";

describe("Products API", () => {
    let sequelize: Sequelize;
    
    beforeAll(async () => {
        sequelize = await setupDB();
    });
    
    afterAll(async () => {
        await sequelize.close();
    });
    
    it("E2E should create a product and check stock", async () => {
        const response = await request(app).post("/api/products").send({
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 100,
            stock: 10,
        });
        
        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Product 1");
        expect(response.body.description).toBe("Product 1 description");
        expect(response.body.purchasePrice).toBe(100);
        expect(response.body.salesPrice).toBe(200);
        expect(response.body.stock).toBe(10);

        const stockResponse = await request(app).get(`/api/products/check-stock/${response.body.id}`);
        expect(stockResponse.status).toBe(200);
        expect(stockResponse.body.stock).toBe(10);
    });
});