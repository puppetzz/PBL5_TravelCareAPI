import { MigrationInterface, QueryRunner } from "typeorm";

export class RenameColumnForRoomTable1686194471232 implements MigrationInterface {
    name = 'RenameColumnForRoomTable1686194471232'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" RENAME COLUMN "freeCancellationPriod" TO "freeCancellationPeriod"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" RENAME COLUMN "freeCancellationPeriod" TO "freeCancellationPriod"`);
    }

}
