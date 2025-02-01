import { DataTypes } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<any> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("order_products", {
    id: {
      type: DataTypes.STRING(255),
      primaryKey: true,
      allowNull: false,
    },
    order_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      references: {
        model: "orders",
        key: "id",
      },
      onDelete: "CASCADE",
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    sales_price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });
};

export const down: MigrationFn<any> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("order_products");
};
