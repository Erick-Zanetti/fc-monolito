import { Sequelize } from "sequelize-typescript";
import { Umzug } from "umzug";
import { migrator } from "src/infra/config/database/migrator";
import PaymentFacadeFactory from "../factory/payment.facade.factory";
import TransactionModel from "../repository/transaction.model";

describe("PaymentFacade test", () => {
  let sequelize: Sequelize;
  let migrated: Umzug<Sequelize>;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [
        TransactionModel,
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

  it("should create a transaction", async () => {
    // const repository = new TransactionRepostiory();
    // const usecase = new ProcessPaymentUseCase(repository);
    // const facade = new PaymentFacade(usecase);

    const facade = PaymentFacadeFactory.create();

    const input = {
      orderId: "order-1",
      amount: 100,
    };

    const output = await facade.process(input);

    expect(output.transactionId).toBeDefined();
    expect(output.orderId).toBe(input.orderId);
    expect(output.amount).toBe(input.amount);
    expect(output.status).toBe("approved");
  });
});
