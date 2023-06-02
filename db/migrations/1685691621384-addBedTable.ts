import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBedTable1685691621384 implements MigrationInterface {
    name = 'AddBedTable1685691621384'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "room" RENAME COLUMN "avaliableRooms" TO "availableRooms"`);
        await queryRunner.query(`ALTER TABLE "room_type" DROP COLUMN "numberOfBeds"`);
        await queryRunner.query(`ALTER TABLE "room_type" DROP COLUMN "typeOfBeds"`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewAt" SET DEFAULT '2023-05-21 07:39:17.896'`);
        await queryRunner.query(`ALTER TABLE "room_type" ADD "typeOfBeds" character varying`);
        await queryRunner.query(`ALTER TABLE "room_type" ADD "numberOfBeds" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "room" RENAME COLUMN "availableRooms" TO "avaliableRooms"`);
    }

}
