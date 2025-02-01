import { DataTypes } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<any> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("orders_clients", {
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true,
      references: {
        model: "orders",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    client_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  });
};

export const down: MigrationFn<any> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("orders_clients");
};
