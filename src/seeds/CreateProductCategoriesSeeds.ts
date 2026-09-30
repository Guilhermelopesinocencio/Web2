import { DataSource } from 'typeorm';
import { ProductCategory } from '../entity/ProductCategories';

// Classe responsável por criar as seeds de categorias de produtos no banco de dados
export default class CreateProductCategoriesSeeds {

    // Método responsável por executar a criação das seeds de categorias de produtos
    public async run(dataSource: DataSource): Promise<void> {
        console.log('Iniciando a criação das seeds de categorias de produtos...');

        // Obter o repositório da entidade ProductCategory
        const productCategoryRepository = dataSource.getRepository(ProductCategory);

        // Verificar se já existem categorias de produtos no banco de dados
        const existingCategories = await productCategoryRepository.count();

        // Se já existirem categorias de produtos, não criar novamente
        if (existingCategories > 0) {
            console.log('As seeds de categorias de produtos já foram criadas anteriormente. Nenhuma ação será realizada.');
            return;
        }

        // Dados das categorias de produtos a serem criadas
        const categoriesData = [
            { name: 'Eletrônicos' },
            { name: 'Vestuário' },
            { name: 'Alimentos' },
        ]

        // Criar as categorias de produtos no banco de dados
        await productCategoryRepository.save(categoriesData);
        console.log('Seeds de categorias de produtos criadas com sucesso!');
    }
}
