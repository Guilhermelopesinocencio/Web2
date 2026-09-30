import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductSituation } from "../entity/ProductSituations";
import { PaginationServices } from "../services/PaginationServices";

const router = express.Router();

//Rota GET para listar todas as situações de produtos com paginação
router.get("/product-situations", async (req: Request, res: Response) => {
    try {
        // Buscar todas as situações de produtos no banco de dados
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        //receber o numero da pagina e definir pagina 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limite = Number(req.query.limit) || 10;

        // Chamar o serviço de paginação para obter os dados paginados
        const result = await PaginationServices.paginate(productSituationRepository, page, limite, { id: "DESC" });

        //retornar a resposta com os ados e informações de paginação
        res.status(200).json(result);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar situações de produtos!",
        });
        return;
    }
});

//Rota GET para visualizar uma situação de produto específica
router.get("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        // Extrair o ID da situação de produto dos parâmetros da rota
        const { id } = req.params;

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Buscar a situação de produto existente pelo ID
        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id as string) });

        // Verificar se a situação de produto foi encontrada
        if (!productSituation) {
            res.status(404).json({
                message: "Situação de produto não encontrada!",
            });
            return;
        }

        // Retornar a resposta com a situação de produto encontrada
        res.status(200).json(productSituation);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar situação de produto!",
        });
        return;
    }
});

//Rota POST para criar uma nova situação de produto
router.post("/product-situations", async (req: Request, res: Response) => {
    try {
        // Extrair os dados da nova situação de produto do corpo da requisição
        var data = req.body;

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Criar uma nova instância da entidade ProductSituation com os dados fornecidos
        const newProductSituation = productSituationRepository.create(data);

        // Salvar a nova situação de produto no banco de dados
        await productSituationRepository.save(newProductSituation);
        res.status(201).json({
            message: "Situação de produto criada com sucesso!",
            ProductSituation: newProductSituation,
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar situação de produto!",

        });


    }
});

//Rota PUT para atualizar uma situação de produto existente
router.put("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        // Extrair o ID da situação de produto dos parâmetros da rota
        const { id } = req.params;

        // Extrair os dados atualizados da situação de produto do corpo da requisição
        var data = req.body;

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Buscar a situação de produto existente pelo ID
        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id as string) });

        // Verificar se a situação de produto foi encontrada
        if (!productSituation) {
            res.status(404).json({
                message: "Situação de produto não encontrada!",
            });
            return;
        }

        // Atualizar os dados da situação de produto com os novos valores
        productSituationRepository.merge(productSituation, data);

        // Salvar as alterações no banco de dados
        const updatedProductSituation = await productSituationRepository.save(productSituation);

        // Retornar a resposta com a situação de produto atualizada
        res.status(200).json({
            message: "Situação de produto atualizada com sucesso!",
            ProductSituation: updatedProductSituation,
        });
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar situação de produto!",
        });
        return;
    }
});

//Rota DELETE para excluir uma situação de produto existente
router.delete("/product-situations/:id", async (req: Request, res: Response) => {
    try {
        // Extrair o ID da situação de produto dos parâmetros da rota
        const { id } = req.params;

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = AppDataSource.getRepository(ProductSituation);

        // Buscar a situação de produto existente pelo ID
        const productSituation = await productSituationRepository.findOneBy({ id: parseInt(id as string) });

        // Verificar se a situação de produto foi encontrada
        if (!productSituation) {
            res.status(404).json({
                message: "Situação de produto não encontrada!",
            });
            return;
        }

        // Excluir a situação de produto do banco de dados
        await productSituationRepository.remove(productSituation);

        // Retornar a resposta de sucesso após a exclusão da situação de produto
        res.status(200).json({
            message: "Situação de produto excluída com sucesso!",
        });
        return;


    } catch (error) {
        res.status(500).json({
            message: "Erro ao excluir situação de produto!",
        });
        return;
    }
});


export default router;
