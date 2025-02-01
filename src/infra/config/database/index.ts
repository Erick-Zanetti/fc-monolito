import { sequelize } from "./database-sequelize";
import { migrator } from "./migrator";

async function setupDB() {
  await migrator(sequelize).up();
  return sequelize;
}

export { setupDB };
