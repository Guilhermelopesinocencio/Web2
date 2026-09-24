import { AppDataSource } from "./data-source";
import CreateSituationsSeeds from "./seeds/CreateSituationsSeeds";

const runSeeds = async () => {
    console.log('Conenctando ao banco de dados...')

    await AppDataSource.initialize();

    console.log('Banco de dados conectado com sucesso!');

    try {

        //Cria a instancia da classe CreateSituationsSeeds
        const situationSeeds = new CreateSituationsSeeds();
        //Executa o método run para criar as seeds
        await situationSeeds.run(AppDataSource);

    } catch (error) {

        console.log('Erro ao executar as seeds:', error);

    } finally {

        await AppDataSource.destroy();
        console.log('Conexão com o banco de dados encerrada.');
    }
};

runSeeds();