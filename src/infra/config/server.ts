import { app } from "../http/express";
import dotenv from "dotenv";
import { setupDB } from "./database";

dotenv.config();
const port: number = Number(process.env.PORT) || 3111;

app.listen(port, async () => {
  await setupDB();
  console.log(`Server is listening on port ${port}`);
});
