import { app } from "../http/express";
import dotenv from "dotenv";
import { setupDB } from "./database";

dotenv.config();
const port: number = Number(process.env.PORT) || 3111;

setupDB();

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
