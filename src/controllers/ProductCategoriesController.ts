import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ProductCategory } from "../entity/ProductCategories";
import { PaginationServices } from "../services/PaginationServices";

const router = express.Router();

//Rota GET para listar todas as categorias de produtos com paginação
router.get("/product-categories", async (req: Request, res: Response) => {
    try {

        // Buscar todas as categorias de produtos no banco de dados
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

        //receber o numero da pagina e definir pagina 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limite = Number(req.query.limit) || 10;

        // Chamar o serviço de paginação para obter os dados paginados
        const result = await PaginationServices.paginate(productCategoryRepository, page, limite, { id: "DESC" });

        //retornar a resposta com os ados e informações de paginação
        res.status(200).json(result);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar categorias de produtos!",
        });
        return;
    }
});

//Rota GET para visualizar uma categoria de produto específica
router.get("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
        const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id as string) });

        if (!productCategory) {
            res.status(404).json({
                message: "Categoria de produto não encontrada!",
            });
            return;
        }

        res.status(200).json(productCategory);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar categoria de produto!",
        });
        return;
    }
});

//Rota POST para criar uma nova categoria de produto
router.post("/product-categories", async (req: Request, res: Response) => {
    try {
        var data = req.body;

        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
        const newProductCategory = productCategoryRepository.create(data);

        await productCategoryRepository.save(newProductCategory);
        res.status(201).json({
            message: "Categoria de produto criada com sucesso!",
            ProductCategory: newProductCategory,
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar categoria de produto!",

        });


    }
});


//Rota PUT para atualizar uma categoria de produto existente
router.put("/product-categories/:id", async (req: Request, res: Response) => {
    try {

        // Extrair o ID da categoria de produto dos parâmetros da rota
        const { id } = req.params;
        // Extrair os dados atualizados da categoria de produto do corpo da requisição
        var data = req.body;

        // Obter o repositório da entidade ProductCategory
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);

        // Buscar a categoria de produto existente pelo ID
        const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id as string) });

        // Verificar se a categoria de produto foi encontrada
        if (!productCategory) {
            res.status(404).json({
                message: "Categoria de produto não encontrada!",
            });
            return;
        }

        // Atualizar os dados da categoria de produto com os novos valores
        productCategoryRepository.merge(productCategory, data);

        // Salvar as alterações no banco de dados
        const updatedProductCategory = await productCategoryRepository.save(productCategory);

        // Retornar a resposta com a categoria de produto atualizada
        res.status(200).json({
            message: "Categoria de produto atualizada com sucesso!",
            ProductCategory: updatedProductCategory,
        });
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar categoria de produto!",
        });
        return;
    }
});

//Rota DELETE para excluir uma categoria de produto existente
router.delete("/product-categories/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const productCategoryRepository = AppDataSource.getRepository(ProductCategory);
        const productCategory = await productCategoryRepository.findOneBy({ id: parseInt(id as string) });

        if (!productCategory) {
            res.status(404).json({
                message: "Categoria de produto não encontrada!",
            });
            return;
        }

        await productCategoryRepository.remove(productCategory);

        res.status(200).json({
            message: "Categoria de produto excluída com sucesso!",
        });
        return;


    } catch (error) {
        res.status(500).json({
            message: "Erro ao excluir categoria de produto!",
        });
        return;
    }
});


export default router;
