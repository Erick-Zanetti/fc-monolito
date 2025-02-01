import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "src/infra/config/database/migrator";
import Id from "../../@shared/domain/value-object/id.value-object";
import OrderModel from "./order.model";
import OrderProductModel from "./product.model";
import OrderClientModel from "./client.model";
import Order from "../domain/order.entity";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import CheckoutRepository from "./checkout.repository";

describe("CheckoutRepository test", () => {
    let sequelize: Sequelize;
    let migrated: Umzug<Sequelize>;
  
    beforeEach(async () => {
      sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false,
        models: [
          OrderModel,
          OrderProductModel,
          OrderClientModel,
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
    
    it("should save an order", async () => {
        const client = new Client({
            id: new Id("1"),
            name: "John Doe",
            email: "john.doe@example.com",
            address: "123 Main St",
        });
        
        const order = new Order({
            id: new Id("1"),
            client,
            status: "pending",
            products: [
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 100,
                }),
            ],
        });
        
        const repository = new CheckoutRepository();
        await repository.addOrder(order);
        
        const orderResult = await OrderModel.findByPk(order.id.id, {
            include: [OrderClientModel, OrderProductModel],
        });
        
        expect(orderResult).not.toBeNull();
        expect(orderResult?.id).toBe(order.id.id);
        expect(orderResult?.status).toBe(order.status);
        expect(orderResult?.client.orderId).toBe(order.id.id);
        expect(orderResult?.products.length).toBe(1);
        expect(orderResult?.products[0].id).toBe(order.products[0].id.id);
    });
    
    it("should find an order", async () => {
        const client = new Client({
            id: new Id("1"),
            name: "John Doe",
            email: "john.doe@example.com",
            address: "123 Main St",
        });
        
        const order = new Order({
            id: new Id("1"),
            client,
            status: "pending",
            products: [
                new Product({
                    id: new Id("1"),
                    name: "Product 1",
                    description: "Product 1 description",
                    salesPrice: 100,
                }),
            ],
        });
        
        const repository = new CheckoutRepository();
        await repository.addOrder(order);
        
        const orderResult = await repository.findOrder("1");
        
        expect(orderResult).not.toBeNull();
        expect(orderResult?.id.id).toBe("1");
        expect(orderResult?.client.name).toBe("John Doe");
    });
});
