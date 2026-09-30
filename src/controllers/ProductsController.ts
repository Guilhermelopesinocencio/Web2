import express, { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { PaginationServices } from "../services/PaginationServices";

const router = express.Router();

//Rota GET para listar todos os produtos com paginação
router.get("/products", async (req: Request, res: Response) => {
    try {
        // Buscar todos os produtos no banco de dados
        const productRepository = AppDataSource.getRepository(Product);

        //receber o numero da pagina e definir pagina 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limite = Number(req.query.limit) || 10;

        // Chamar o serviço de paginação para obter os dados paginados
        const result = await PaginationServices.paginate(productRepository, page, limite, { id: "DESC" });

        //retornar a resposta com os ados e informações de paginação
        res.status(200).json(result);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar produtos!",
        });
        return;
    }
});

//Rota GET para visualizar um produto específico
router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        // Extrair o ID do produto dos parâmetros da rota
        const { id } = req.params;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto existente pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id as string) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }
        // Retornar a resposta com o produto encontrado
        res.status(200).json(product);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar produto!",
        });
        return;
    }
});

//Rota POST para criar um novo produto
router.post("/products", async (req: Request, res: Response) => {
    try {
        // Extrair os dados do novo produto do corpo da requisição
        var data = req.body;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Criar uma nova instância do produto com os dados fornecidos
        const newProduct = productRepository.create(data);

        // Salvar o novo produto no banco de dados
        await productRepository.save(newProduct);
        res.status(201).json({
            message: "Produto criado com sucesso!",
            Product: newProduct,
        });

    } catch (error) {
        res.status(500).json({
            message: "Erro ao criar produto!",

        });


    }
});

//Rota PUT para atualizar um produto existente
router.put("/products/:id", async (req: Request, res: Response) => {
    try {
        // Extrair o ID do produto dos parâmetros da rota
        const { id } = req.params;

        // Extrair os dados atualizados do produto do corpo da requisição
        var data = req.body;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto existente pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id as string) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }

        // Atualizar os dados do produto com os novos valores
        productRepository.merge(product, data);

        // Salvar as alterações no banco de dados
        const updatedProduct = await productRepository.save(product);

        // Retornar a resposta com o produto atualizado
        res.status(200).json({
            message: "Produto atualizado com sucesso!",
            Product: updatedProduct,
        });
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao atualizar produto!",
        });
        return;
    }
});

//Rota DELETE para excluir um produto existente
router.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        // Extrair o ID do produto dos parâmetros da rota
        const { id } = req.params;

        // Obter o repositório da entidade Product
        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto existente pelo ID
        const product = await productRepository.findOneBy({ id: parseInt(id as string) });

        // Verificar se o produto foi encontrado
        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }

        // Excluir o produto do banco de dados
        await productRepository.remove(product);

        // Retornar a resposta de sucesso após a exclusão do produto
        res.status(200).json({
            message: "Produto excluído com sucesso!",
        });
        return;


    } catch (error) {
        res.status(500).json({
            message: "Erro ao excluir produto!",
        });
        return;
    }
});


export default router;
