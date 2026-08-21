import express, { Request, Response } from "express";


import { AppDataSource } from "../data-source";


const router = express.Router();

AppDataSource.initialize().then(() => {
    console.log("Conexão do banco de dados inicializada!");
}).catch((error) => {
    console.error("Erro na conexão com o banco de dados:", error);
});

router.get("/", (req: Request, res: Response) => {
    res.send("Bem vindo tela de login");
});

export default router;