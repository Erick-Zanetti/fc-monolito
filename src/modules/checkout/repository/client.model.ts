import { Column, Model, Table, ForeignKey, PrimaryKey } from "sequelize-typescript";
import OrderModel from "./order.model";

@Table({
  tableName: "orders_clients",
  timestamps: false,
})
export default class OrderClientModel extends Model {
  @PrimaryKey
  @ForeignKey(() => OrderModel)
  @Column({ allowNull: false, field: "order_id" })
  orderId: string;

  @Column({ allowNull: false, field: "client_id" })
  clientId: string;

  @Column({ allowNull: false })
  name: string;

  @Column({ allowNull: false })
  email: string;

  @Column({ allowNull: false })
  address: string;
}
