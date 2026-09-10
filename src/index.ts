import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();

//Middleware para receber requisições no formato JSON
app.use(express.json());

import AuthController from "./controllers/AuthController";
import SituationsController from "./controllers/SituationsController";

app.use("/", AuthController)
app.use("/", SituationsController);

app.listen(process.env.PORT, () => {
    console.log(`iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});