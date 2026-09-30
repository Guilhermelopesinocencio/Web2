import { Repository, ObjectLiteral, FindOptionsOrder } from 'typeorm';

interface PaginationResult<T> {
    error: boolean;
    data: T[];
    currentPage: number;
    lastPage: number;
    totalItems: number;
}

export class PaginationServices {
    static async paginate<t extends ObjectLiteral>(
        repository: Repository<t>,
        page: number = 1,
        limite: number = 10,
        order: FindOptionsOrder<t> = {}

    ): Promise<PaginationResult<t>> {

        const totalRecords = await repository.count();
        const lastPage = Math.ceil(totalRecords / limite);

        if (page > lastPage && lastPage > 0) {
            throw new Error(`Página Inválida. O total de páginas é ${lastPage}`);
        }

        const offset = (page - 1) * limite;

        const data = await repository.find({
            skip: offset,
            take: limite,
            order: order,
        });

        return {
            error: false,
            data: data,
            currentPage: page,
            lastPage: lastPage,
            totalItems: totalRecords
        };
    }
}