import "reflect-metadata";
import "express-async-errors";
import cors from "cors";
import express from "express";
import helmet from "helmet";

import { Controller } from "./Controller";

const app = express();
const controller = new Controller();
const port = process.env.PORT;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.post("/infos", controller.postRouteInfos);
app.post("/entropia", controller.postRouteEntropia);
app.use(controller.errorHandler);
process.on("SIGTERM", () => process.exit());
app.listen(port, () => console.log(`Server started at ${port}`));
