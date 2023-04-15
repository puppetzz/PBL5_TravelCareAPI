import { MigrationInterface, QueryRunner } from "typeorm";

export class addColumnReviewCountForTabelLocation1681539511788 implements MigrationInterface {
    name = 'addColumnReviewCountForTabelLocation1681539511788'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" ADD "reviewCount" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-15T06:18:32.315Z'`);
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-15T06:18:32.318Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" ALTER COLUMN "reviewDate" SET DEFAULT '2023-04-14 17:25:11.702'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-14 17:25:11.699'`);
        await queryRunner.query(`ALTER TABLE "location" DROP COLUMN "reviewCount"`);
    }

}
