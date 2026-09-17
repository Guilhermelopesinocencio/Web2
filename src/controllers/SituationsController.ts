import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";

const router = express.Router();

//Criar Lista
router.get("/situations", async (req: Request, res: Response) => {
    try {
        const situationRepository = AppDataSource.getRepository(Situation);
        const situations = await situationRepository.find();

        res.status(200).json(situations);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar situações!",
        });
        return;
    }
});

//Rota GET para visualizar uma situação específica
router.get("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }

        res.status(200).json(situation);
        return;


    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar situação!",
        });
        return;
    }
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


//Rota PUT Atualizar uma situação específica
router.put("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        var data = req.body;

        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }

        //Atualizar os dados da situação com os novos valores
        situationRepository.merge(situation, data);

        // Salvar as alterações no banco de dados
        const updatedSituation = await situationRepository.save(situation);

        res.status(200).json({
            message: "Situação atualizada com sucesso!",
            Situation: updatedSituation,
        });
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar situação!",
        });
        return;
    }
});


//Rota DELETE uma situação específica
router.delete("/situations/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const situationRepository = AppDataSource.getRepository(Situation);
        const situation = await situationRepository.findOneBy({ id: parseInt(id as string) });

        if (!situation) {
            res.status(404).json({
                message: "Situação não encontrada!",
            });
            return;
        }

        // Excluir a situação
        await situationRepository.remove(situation);

        res.status(200).json({
            message: "Situação excluída com sucesso!",
        });
        return;


    } catch (error) {
        res.status(500).json({
            message: "Erro ao excluir situação!",
        });
        return;
    }
});


export default router;