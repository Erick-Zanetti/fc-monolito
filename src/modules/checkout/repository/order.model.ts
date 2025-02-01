import { Column, Model, PrimaryKey, Table, HasOne, HasMany } from "sequelize-typescript";
import OrderClientModel from "./client.model";
import OrderProductModel from "./product.model";

@Table({
  tableName: "orders",
  timestamps: false,
})
export default class OrderModel extends Model {
  @PrimaryKey
  @Column({ allowNull: false })
  id: string;

  @Column({ allowNull: false })
  status: string;

  @Column({ allowNull: false })
  createdAt: Date;

  @Column({ allowNull: false })
  updatedAt: Date;

  @HasOne(() => OrderClientModel, { foreignKey: "orderId", onDelete: "CASCADE" })
  client: OrderClientModel;

  @HasMany(() => OrderProductModel, { foreignKey: "orderId", onDelete: "CASCADE" })
  products: OrderProductModel[];
}
