import { MigrationInterface, QueryRunner } from "typeorm";

export class addUpdateAtFieldForReview1682088149196 implements MigrationInterface {
    name = 'addUpdateAtFieldForReview1682088149196'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "reviewDate"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "reviewAt" TIMESTAMP NOT NULL DEFAULT '2023-04-21T14:42:29.798Z'`);
        await queryRunner.query(`ALTER TABLE "review" ADD "updateAt" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T14:42:29.795Z'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T14:42:29.806Z'`);
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21T14:42:29.807Z'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "booking" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 14:18:29.736'`);
        await queryRunner.query(`ALTER TABLE "receipt" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 14:18:29.736'`);
        await queryRunner.query(`ALTER TABLE "account" ALTER COLUMN "createAt" SET DEFAULT '2023-04-21 14:18:29.654'`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "updateAt"`);
        await queryRunner.query(`ALTER TABLE "review" DROP COLUMN "reviewAt"`);
        await queryRunner.query(`ALTER TABLE "review" ADD "reviewDate" TIMESTAMP NOT NULL DEFAULT '2023-04-21 14:18:29.73'`);
    }

}
