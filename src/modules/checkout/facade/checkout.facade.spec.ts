import { Umzug } from "umzug";
import { Sequelize } from "sequelize-typescript";
import { migrator } from "src/infra/config/database/migrator";
import { ClientModel } from "src/modules/client-adm/repository/client.model";
import { ProductModel as ProductModelProductAdm } from "src/modules/product-adm/repository/product.model";
import ProductModelStoreCatalog from "src/modules/store-catalog/repository/product.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import TransactionModel from "src/modules/payment/repository/transaction.model";
import InvoiceModel from "src/modules/invoice/repository/invoice.model";
import InvoiceItemModel from "src/modules/invoice/repository/invoice-item.model";
import OrderModel from "../repository/order.model";
import OrderProductModel from "../repository/product.model";
import OrderClientModel from "../repository/client.model";

describe("CheckoutFacade test", () => {
  let sequelize: Sequelize;
  let migrated: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [
        ClientModel,
        ProductModelProductAdm,
        ProductModelStoreCatalog,
        TransactionModel,
        InvoiceModel,
        InvoiceItemModel,
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

  it("should create a checkout", async () => {
    await ClientModel.create({
      id: "1",
      name: "John Doe",
      email: "john.doe@example.com",
      document: "1234567890",
      street: "123 Main St",
      number: "123",
      complement: "Apt 1",
      city: "Anytown",
      state: "CA",
      zipcode: "12345",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await ProductModelProductAdm.upsert({
      id: "1",
      name: "Product 1",
      description: "Product 1 description",
      purchasePrice: 100,
      stock: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    await ProductModelStoreCatalog.update(
      { salesPrice: 100 },
      { where: { id: "1" } }
    );
    
    
    const facade = CheckoutFacadeFactory.create();
    const input = {
      clientId: "1",
      products: [
        {
          productId: "1",
          quantity: 1,
        },
      ],
    };
    const output = await facade.checkout(input);
    
    expect(output.id).toBeDefined();
    expect(output.status).toBe("approved");
    expect(output.total).toBe(100);
    
  });
});
