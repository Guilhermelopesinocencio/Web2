import { DataSource } from 'typeorm';
import { Situation } from '../entity/Situations';

export default class CreateSituationsSeeds {
    public async run(dataSource: DataSource): Promise<void> {
        console.log('Iniciando a criação das seeds de situações...');

        const situationRepository = dataSource.getRepository(Situation);

        const existingSituations = await situationRepository.count();

        if (existingSituations > 0) {
            console.log('As seeds de situações já foram criadas anteriormente. Nenhuma ação será realizada.');
            return;
        }

        const situationsData = [
            { nameSituation: 'Ativo' },
            { nameSituation: 'Inativo' },
            { nameSituation: 'Pendente' },
        ]

        await situationRepository.save(situationsData);
        console.log('Seeds de situações criadas com sucesso!');
    }
}