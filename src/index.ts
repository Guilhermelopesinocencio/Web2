import express from "express";

import dotenv from "dotenv";
dotenv.config();

const app = express();

import login from "./controllers/login";

app.use("/", login);

app.listen(process.env.PORT, () => {
    console.log(`iniciado na porta ${process.env.PORT}: http://localhost:${process.env.PORT}`);
});