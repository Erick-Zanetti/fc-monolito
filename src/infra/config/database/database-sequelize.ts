import { Sequelize } from "sequelize-typescript";
import OrderClientModel from "src/modules/checkout/repository/client.model";
import OrderModel from "src/modules/checkout/repository/order.model";
import OrderProductModel from "src/modules/checkout/repository/product.model";
import { ClientModel } from "src/modules/client-adm/repository/client.model";
import InvoiceItemModel from "src/modules/invoice/repository/invoice-item.model";
import InvoiceModel from "src/modules/invoice/repository/invoice.model";
import TransactionModel from "src/modules/payment/repository/transaction.model";
import { ProductModel as ProductModelProductAdm } from "src/modules/product-adm/repository/product.model";
import { default as ProductModelStoreCatalog } from "src/modules/store-catalog/repository/product.model";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: false,
  models: [
    OrderModel,
    OrderClientModel,
    OrderProductModel,
    ClientModel,
    InvoiceModel,
    InvoiceItemModel,
    ProductModelProductAdm,
    ProductModelStoreCatalog,
    TransactionModel,
  ]
});

export { sequelize };