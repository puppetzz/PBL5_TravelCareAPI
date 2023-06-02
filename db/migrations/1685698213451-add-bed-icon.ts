import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBedIcon1685698213451 implements MigrationInterface {
    name = 'AddBedIcon1685698213451'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bed" ADD "icon" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "bed" DROP COLUMN "icon"`);
    }

}
