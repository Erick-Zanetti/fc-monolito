import request from "supertest";
import { Sequelize } from "sequelize-typescript";
import { setupDB } from "src/infra/config/database";
import { app } from "src/infra/http/express";

describe("Client API", () => {
    let sequelize: Sequelize;
    
    beforeAll(async () => {
        sequelize = await setupDB();
    });
    
    afterAll(async () => {
        await sequelize.close();
    });

    it("E2E should create a client and find it", async () => {
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

        expect(response.status).toBe(201);
        expect(response.body.name).toBe("Client 1");
        expect(response.body.email).toBe("client1@email.com");
        expect(response.body.document).toBe("1234567890");
        
        const findResponse = await request(app).get(`/api/clients/${response.body.id}`);
        expect(findResponse.status).toBe(200);
        expect(findResponse.body.name).toBe("Client 1");
        expect(findResponse.body.email).toBe("client1@email.com");
        expect(findResponse.body.document).toBe("1234567890");
    });
});