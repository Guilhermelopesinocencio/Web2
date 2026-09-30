import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Situation } from "../entity/Situations";
import { PaginationServices } from "../services/PaginationServices";

const router = express.Router();

//Criar Lista
router.get("/situations", async (req: Request, res: Response) => {
    try {
        // Buscar todas as situações no banco de dados
        const situationRepository = AppDataSource.getRepository(Situation);

        //receber o numero da pagina e definir pagina 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limite = Number(req.query.limit) || 10;

        const result = await PaginationServices.paginate(situationRepository, page, limite, { id: "DESC" });

        //retornar a resposta com os ados e informações de paginação
        res.status(200).json(result);
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