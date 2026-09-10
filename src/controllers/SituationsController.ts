import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

const router = express.Router();

//Rota GET principal
router.get("/situations", (req: Request, res: Response) => {
    res.send("Bem vindo tela de Situations");
});

//Rota POST
router.post("/situations", async (req: Request, res: Response) => {
    try {
        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);
        const newSituation = situationRepository.create(data);

        await situationRepository.save(newSituation);
        res.status(201).json({
            message: "Situação criada com sucesso!",
            Situation: newSituation,
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar situação!",

        });


    }
});

export default router;