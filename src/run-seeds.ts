import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";
import CreateProductCategoriesSeeds from "./seeds/CreateProductCategoriesSeeds";
import CreateProductSituationsSeeds from "./seeds/CreateProductSituationsSeeds";
import CreateProductsSeeds from "./seeds/CreateProductsSeeds";

// Função para executar as seeds
const runSeeds = async () => {
    console.log('Conenctando ao banco de dados...')

    // Inicializar a conexão com o banco de dados usando o AppDataSource
    await AppDataSource.initialize();

    console.log('Banco de dados conectado com sucesso!');

    try {

        //Cria a instancia da classe CreateSituationsSeeds
        const situationSeeds = new CreateSituationsSeeds();
        //Executa o método run para criar as seeds
        await situationSeeds.run(AppDataSource);

        const productCategoriesSeeds = new CreateProductCategoriesSeeds();
        await productCategoriesSeeds.run(AppDataSource);

        const productSituationsSeeds = new CreateProductSituationsSeeds();
        await productSituationsSeeds.run(AppDataSource);

        const productsSeeds = new CreateProductsSeeds();
        await productsSeeds.run(AppDataSource);

    } catch (error) {

        console.log('Erro ao executar as seeds:', error);

    } finally {

        await AppDataSource.destroy();
        console.log('Conexão com o banco de dados encerrada.');
    }
};

runSeeds();