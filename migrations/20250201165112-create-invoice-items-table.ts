import { DataTypes } from "sequelize";
import { MigrationFn } from "umzug";

export const up: MigrationFn<any> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().createTable("invoice_items", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    invoiceId: {
      type: DataTypes.STRING,
      allowNull: false,
      references: {
        model: "invoices",
        key: "id",
      },
      onDelete: "CASCADE",
    },
  });
};

export const down: MigrationFn<any> = async ({ context: sequelize }) => {
  await sequelize.getQueryInterface().dropTable("invoice_items");
};

