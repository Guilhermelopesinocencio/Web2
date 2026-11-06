import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFieldsToUsers1793986761733 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("users", [
            new TableColumn({ name: "password", type: "varchar", length: "255", isNullable: true }),
            new TableColumn({ name: "recoverPassword", type: "varchar", length: "255", isNullable: true }),
        ]);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("users", ["password", "recoverPassword"]);
    }
}