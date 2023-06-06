import { MigrationInterface, QueryRunner } from "typeorm";

export class AddColumnIsRegisteredForHotelTable1685977826319 implements MigrationInterface {
    name = 'AddColumnIsRegisteredForHotelTable1685977826319'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel" ADD "isRegistered" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "hotel" DROP COLUMN "isRegistered"`);
    }

}
