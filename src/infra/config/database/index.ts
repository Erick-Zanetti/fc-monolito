import { sequelize } from "./database-sequelize";
import { migrator } from "./migrator";

function setupDB() {
  migrator(sequelize);
}

export { setupDB };
