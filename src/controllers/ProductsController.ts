import express, { Request, Response } from "express";
import slugify from "slugify";
import { AppDataSource } from "../data-source";
import { Product } from "../entity/Products";
import { PaginationServices } from "../services/PaginationServices";
import * as yup from "yup";

const router = express.Router();

// Rota GET para listar todos os produtos com paginação
router.get("/products", async (req: Request, res: Response) => {
    try {
        const productRepository = AppDataSource.getRepository(Product);

        // Receber o número da página e definir página 1 como padrão
        const page = Number(req.query.page) || 1;

        // Definir o limite de registros por página
        const limite = Number(req.query.limit) || 10;

        // Chamar o serviço de paginação para obter os dados paginados
        const result = await PaginationServices.paginate(productRepository, page, limite, { id: "DESC" });

        res.status(200).json(result);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar produtos!",
        });
        return;
    }
});

// Rota GET para visualizar um produto específico
router.get("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const productRepository = AppDataSource.getRepository(Product);

        // Buscar o produto pelo ID, já carregando situação e categoria
        const product = await productRepository.findOne({
            where: { id: parseInt(id as string) },
            relations: {
                productSituation: true,
                productCategory: true,
            },
        });

        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }

        res.status(200).json(product);
        return;

    } catch (error) {
        res.status(500).json({
            message: "Erro ao buscar produto!",
        });
        return;
    }
});

// Rota POST para criar um novo produto
router.post("/products", async (req: Request, res: Response) => {
    try {
        var data = req.body;

        const schema = yup.object().shape({
            name: yup.string()
                .required("O campo name é obrigatório!")
                .min(3, "O campo name deve ter no mínimo 3 caracteres!"),
            description: yup.string()
                .required("O campo description é obrigatório!")
                .min(3, "O campo description deve ter no mínimo 3 caracteres!"),
            price: yup.number()
                .typeError("O campo price deve ser um número!")
                .required("O campo price é obrigatório!")
                .positive("O campo price deve ser maior que zero!"),
        });

        await schema.validate(data, { abortEarly: false });

        // Gerar o slug automaticamente (ex.: "Camiseta Azul" -> "camiseta-azul")
        data.slug = slugify(data.name, { lower: true, strict: true });

        const productRepository = AppDataSource.getRepository(Product);

        const newProduct = productRepository.create(data);

        await productRepository.save(newProduct);

        res.status(201).json({
            message: "Produto criado com sucesso!",
            Product: newProduct,
        });
        return;

    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors,
            });
            return;
        }

        // Slug duplicado (violação da chave unique)
        if (error?.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                message: "Já existe um produto com esse nome (slug duplicado)!",
            });
            return;
        }

        res.status(500).json({
            message: "Erro ao criar produto!",
        });
        return;
    }
});
// Rota PUT para atualizar um produto existente
router.put("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        var data = req.body;

        const schema = yup.object().shape({
            name: yup.string()
                .required("O campo name é obrigatório!")
                .min(3, "O campo name deve ter no mínimo 3 caracteres!"),
            description: yup.string()
                .required("O campo description é obrigatório!")
                .min(3, "O campo description deve ter no mínimo 3 caracteres!"),
            price: yup.number()
                .typeError("O campo price deve ser um número!")
                .required("O campo price é obrigatório!")
                .positive("O campo price deve ser maior que zero!"),
        });

        await schema.validate(data, { abortEarly: false });

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({ id: parseInt(id as string) });

        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }

        // Como o name agora é obrigatório, o slug é sempre regerado
        data.slug = slugify(data.name, { lower: true, strict: true });

        productRepository.merge(product, data);

        const updatedProduct = await productRepository.save(product);

        res.status(200).json({
            message: "Produto atualizado com sucesso!",
            Product: updatedProduct,
        });
        return;

    } catch (error: any) {
        if (error instanceof yup.ValidationError) {
            res.status(400).json({
                message: error.errors,
            });
            return;
        }

        if (error?.code === "ER_DUP_ENTRY") {
            res.status(409).json({
                message: "Já existe um produto com esse nome (slug duplicado)!",
            });
            return;
        }

        res.status(500).json({
            message: "Erro ao atualizar produto!",
        });
        return;
    }
});

// Rota DELETE para excluir um produto existente
router.delete("/products/:id", async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const productRepository = AppDataSource.getRepository(Product);

        const product = await productRepository.findOneBy({ id: parseInt(id as string) });

        if (!product) {
            res.status(404).json({
                message: "Produto não encontrado!",
            });
            return;
        }

        await productRepository.remove(product);

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