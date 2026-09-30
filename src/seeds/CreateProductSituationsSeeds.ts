import { DataSource } from 'typeorm';
import { ProductSituation } from '../entity/ProductSituations';

// Classe responsável por criar as seeds de situações de produtos no banco de dados
export default class CreateProductSituationsSeeds {

    // Método responsável por executar a criação das seeds de situações de produtos
    public async run(dataSource: DataSource): Promise<void> {
        console.log('Iniciando a criação das seeds de situações de produtos...');

        // Obter o repositório da entidade ProductSituation
        const productSituationRepository = dataSource.getRepository(ProductSituation);

        // Verificar se já existem situações de produtos no banco de dados
        const existingSituations = await productSituationRepository.count();

        // Se já existirem situações de produtos, não criar novamente
        if (existingSituations > 0) {
            console.log('As seeds de situações de produtos já foram criadas anteriormente. Nenhuma ação será realizada.');
            return;
        }

        // Dados das situações de produtos a serem criadas
        const situationsData = [
            { name: 'Disponível' },
            { name: 'Esgotado' },
            { name: 'Descontinuado' },
        ]

        // Criar as situações de produtos no banco de dados
        await productSituationRepository.save(situationsData);
        console.log('Seeds de situações de produtos criadas com sucesso!');
    }
}
