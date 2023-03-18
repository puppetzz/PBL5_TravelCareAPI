import { MigrationInterface, QueryRunner } from "typeorm";

export class allowNullDescriptionDistrict1679049614402 implements MigrationInterface {
    name = 'allowNullDescriptionDistrict1679049614402'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "district" ALTER COLUMN "description" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17T10:40:14.950Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-03-17 07:52:11.634'`);
        await queryRunner.query(`ALTER TABLE "district" ALTER COLUMN "description" SET NOT NULL`);
    }

}
