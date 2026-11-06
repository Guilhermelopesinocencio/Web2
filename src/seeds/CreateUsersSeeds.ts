import { DataSource } from 'typeorm';
import bcrypt from 'bcryptjs';
import { User } from '../entity/Users';
import { Situation } from '../entity/Situations';

// Classe responsável por criar as seeds de usuários no banco de dados
export default class CreateUsersSeeds {

    // Método responsável por executar a criação das seeds de usuários
    public async run(dataSource: DataSource): Promise<void> {
        console.log('Iniciando a criação das seeds de usuários...');

        // Obter o repositório da entidade User
        const userRepository = dataSource.getRepository(User);

        // Verificar se já existem usuários no banco de dados
        const existingUsers = await userRepository.count();

        // Se já existirem usuários, não criar novamente
        if (existingUsers > 0) {
            console.log('As seeds de usuários já foram criadas anteriormente. Nenhuma ação será realizada.');
            return;
        }

        // Obter as situações já cadastradas
        const situationRepository = dataSource.getRepository(Situation);
        const situations = await situationRepository.find();

        // Se não existirem situações, encerrar a execução
        if (situations.length === 0) {
            console.log('Situações não encontradas. Execute as seeds anteriores primeiro.');
            return;
        }

        // Gerar o hash da senha (nunca salvar a senha em texto puro)
        const passwordHash = await bcrypt.hash('123456', 10);

        // Dados dos usuários a serem criados
        const usersData = [
            {
                name: 'Administrador',
                email: 'admin@teste.com',
                password: passwordHash,
                situation: situations[0],
            },
        ]

        // Criar os usuários no banco de dados
        await userRepository.save(usersData);
        console.log('Seeds de usuários criadas com sucesso!');
    }
}