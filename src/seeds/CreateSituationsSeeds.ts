import { DataSource } from 'typeorm';
import { Situation } from '../entity/Situations';

// Classe responsável por criar as seeds de situações no banco de dados
export default class CreateSituationsSeeds {

    // Método responsável por executar a criação das seeds de situações
    public async run(dataSource: DataSource): Promise<void> {
        console.log('Iniciando a criação das seeds de situações...');

        // Obter o repositório da entidade Situation
        const situationRepository = dataSource.getRepository(Situation);

        // Verificar se já existem situações no banco de dados
        const existingSituations = await situationRepository.count();

        // Se já existirem situações, não criar novamente
        if (existingSituations > 0) {
            console.log('As seeds de situações já foram criadas anteriormente. Nenhuma ação será realizada.');
            return;
        }

        // Dados das situações a serem criadas
        const situationsData = [
            { nameSituation: 'Ativo' },
            { nameSituation: 'Inativo' },
            { nameSituation: 'Pendente' },
        ]

        // Criar as situações no banco de dados
        await situationRepository.save(situationsData);
        console.log('Seeds de situações criadas com sucesso!');
    }
}