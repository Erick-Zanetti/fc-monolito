import express, { Express } from "express";
import { Sequelize } from "sequelize-typescript";
import { clientRoutes } from "../api/routes/client.routes";
import { productRoutes } from "../api/routes/product.routes";
import { invoiceRoutes } from "../api/routes/invoice.routes";
import { checkoutRoutes } from "../api/routes/checkout.routes";
export const app: Express = express();

app.use(express.json());

app.use("/api", clientRoutes);
app.use("/api", productRoutes);
app.use("/api", invoiceRoutes);
app.use("/api", checkoutRoutes);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
}
setupDb();
